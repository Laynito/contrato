import {
  MINIMUM_BENEFITS,
  MINIMUM_WAGE_2026,
  RELATION_TYPES,
  RULES_VERSION,
  SPECIAL_REVIEW_FLAGS,
  WEEKLY_HOURS_BY_YEAR,
  WEEKLY_OVERTIME_BY_YEAR,
} from './legal.js';

const REQUIRED = [
  ['employer.name', 'Nombre del patrón'],
  ['employer.address', 'Domicilio del patrón'],
  ['worker.name', 'Nombre de la persona trabajadora'],
  ['worker.address', 'Domicilio de la persona trabajadora'],
  ['worker.birthDate', 'Fecha de nacimiento'],
  ['worker.nationality', 'Nacionalidad'],
  ['worker.sex', 'Sexo'],
  ['worker.civilStatus', 'Estado civil'],
  ['worker.curp', 'CURP'],
  ['worker.rfc', 'RFC'],
  ['job.title', 'Puesto/servicios'],
  ['job.workplace', 'Lugar de trabajo'],
  ['relation.type', 'Tipo de relación'],
  ['relation.startDate', 'Fecha de inicio'],
  ['schedule.weeklyHours', 'Horas semanales'],
  ['salary.daily', 'Salario diario'],
  ['salary.paymentMethod', 'Forma de pago'],
  ['salary.paymentFrequency', 'Periodicidad de pago'],
  ['benefits.aguinaldoDays', 'Días de aguinaldo'],
  ['benefits.vacationDays', 'Días de vacaciones'],
  ['benefits.vacationPremiumPercent', 'Prima vacacional'],
];

function getPath(object, path) {
  return path.split('.').reduce((value, key) => value?.[key], object);
}

function hasValue(value) {
  return value !== undefined && value !== null && value !== '';
}

function ageOn(dateOfBirth, atDate = new Date()) {
  const birth = new Date(`${dateOfBirth}T00:00:00Z`);
  if (Number.isNaN(birth.getTime())) return null;
  let age = atDate.getUTCFullYear() - birth.getUTCFullYear();
  const month = atDate.getUTCMonth() - birth.getUTCMonth();
  if (month < 0 || (month === 0 && atDate.getUTCDate() < birth.getUTCDate())) age -= 1;
  return age;
}

export function applicableMinimumDaily(input) {
  const zone = input?.salary?.zone === 'ZLFN' ? 'zlfn' : 'general';
  const general = MINIMUM_WAGE_2026[zone];
  const professional = Number(input?.salary?.professionalMinimumDaily || 0);
  return Math.max(general, professional);
}

export function evaluateContract(input, now = new Date()) {
  const incomplete = [];
  const blockers = [];
  const reviews = [];
  const warnings = [];
  const year = Number(input?.legalYear || now.getUTCFullYear());

  for (const [path, label] of REQUIRED) {
    if (!hasValue(getPath(input, path))) incomplete.push({ code: `MISSING_${path.toUpperCase().replaceAll('.', '_')}`, message: `Falta ${label}.` });
  }

  const relationType = input?.relation?.type;
  if (hasValue(relationType) && !RELATION_TYPES.includes(relationType)) {
    blockers.push({ code: 'RELATION_TYPE_INVALID', message: 'El tipo de relación no pertenece al catálogo jurídico V1.' });
  }
  if (relationType === 'DETERMINADO' && !hasValue(input?.relation?.temporaryCause)) {
    blockers.push({ code: 'FIXED_TERM_WITHOUT_CAUSE', message: 'La relación por tiempo determinado requiere una causa jurídica documentada; no basta elegir una duración.' });
  }
  if (relationType === 'OBRA' && !hasValue(input?.relation?.workDescription)) {
    blockers.push({ code: 'WORK_TERM_WITHOUT_WORK', message: 'La relación por obra determinada requiere identificar la obra.' });
  }
  if (relationType === 'TEMPORADA' && !hasValue(input?.relation?.seasonDescription)) {
    blockers.push({ code: 'SEASON_WITHOUT_DESCRIPTION', message: 'La relación de temporada requiere describir el periodo o actividad estacional.' });
  }

  const maxWeekly = WEEKLY_HOURS_BY_YEAR[year];
  if (!maxWeekly) reviews.push({ code: 'YEAR_RULES_NOT_VERSIONED', message: `No hay reglas de jornada versionadas para ${year}.` });
  const weeklyHours = Number(input?.schedule?.weeklyHours || 0);
  if (maxWeekly && weeklyHours > maxWeekly) blockers.push({ code: 'WEEKLY_HOURS_EXCEEDED', message: `La jornada propuesta excede el máximo semanal versionado para ${year} (${maxWeekly} h).` });

  const overtime = Number(input?.schedule?.plannedOvertimeHours || 0);
  const maxOvertime = WEEKLY_OVERTIME_BY_YEAR[year];
  if (maxOvertime !== undefined && overtime > maxOvertime) blockers.push({ code: 'OVERTIME_EXCEEDED', message: `Las horas extraordinarias propuestas exceden el máximo semanal versionado para ${year} (${maxOvertime} h).` });

  const dailySalary = Number(input?.salary?.daily || 0);
  const minDaily = applicableMinimumDaily(input);
  if (hasValue(input?.salary?.daily) && dailySalary < minDaily) blockers.push({ code: 'SALARY_BELOW_MINIMUM', message: `El salario diario ($${dailySalary.toFixed(2)}) es inferior al mínimo aplicable ($${minDaily.toFixed(2)}).` });

  const aguinaldo = Number(input?.benefits?.aguinaldoDays || 0);
  if (hasValue(input?.benefits?.aguinaldoDays) && aguinaldo < MINIMUM_BENEFITS.aguinaldoDays) blockers.push({ code: 'AGUINALDO_BELOW_MINIMUM', message: `El aguinaldo no puede ser inferior a ${MINIMUM_BENEFITS.aguinaldoDays} días.` });

  const premium = Number(input?.benefits?.vacationPremiumPercent || 0);
  if (hasValue(input?.benefits?.vacationPremiumPercent) && premium < MINIMUM_BENEFITS.vacationPremiumPercent) blockers.push({ code: 'VACATION_PREMIUM_BELOW_MINIMUM', message: `La prima vacacional no puede ser inferior a ${MINIMUM_BENEFITS.vacationPremiumPercent}%.` });

  const vacationDays = Number(input?.benefits?.vacationDays || 0);
  if (hasValue(input?.benefits?.vacationDays) && vacationDays < MINIMUM_BENEFITS.firstYearVacationDays) blockers.push({ code: 'VACATION_BELOW_FIRST_YEAR_MINIMUM', message: `Para el primer año, el flujo V1 no permite menos de ${MINIMUM_BENEFITS.firstYearVacationDays} días de vacaciones.` });

  const remotePercent = Number(input?.telework?.percent || 0);
  if (remotePercent > 40) {
    if (!input?.telework?.equipmentDefined) blockers.push({ code: 'TELEWORK_EQUIPMENT_MISSING', message: 'Teletrabajo >40% requiere definir equipo e insumos.' });
    if (!input?.telework?.costsDefined) blockers.push({ code: 'TELEWORK_COSTS_MISSING', message: 'Teletrabajo >40% requiere definir costos proporcionales de telecomunicaciones/electricidad.' });
    if (!input?.telework?.disconnectDefined) blockers.push({ code: 'TELEWORK_DISCONNECT_MISSING', message: 'Teletrabajo >40% requiere reconocer el derecho a la desconexión.' });
  }

  const age = input?.worker?.birthDate ? ageOn(input.worker.birthDate, now) : null;
  if (age !== null && age < 15) blockers.push({ code: 'UNDER_MINIMUM_WORKING_AGE', message: 'El flujo V1 bloquea generación para menores de 15 años.' });
  if (age !== null && age >= 15 && age < 18) reviews.push({ code: SPECIAL_REVIEW_FLAGS[0], message: 'Persona menor de 18 años: requiere revisión especial antes de emitir.' });

  if (input?.clauses?.postEmploymentNonCompete) reviews.push({ code: SPECIAL_REVIEW_FLAGS[1], message: 'La no competencia post-empleo requiere revisión especial y no se genera automáticamente.' });
  if (input?.specialWork) reviews.push({ code: SPECIAL_REVIEW_FLAGS[2], message: 'Trabajo especial: requiere flujo jurídico específico.' });

  if (input?.imss?.provided === false) warnings.push({ code: 'IMSS_NOT_PROVIDED', message: 'La ausencia de datos IMSS no bloquea el contrato, pero no elimina obligaciones legales externas del patrón.' });

  let status = 'COMPLETO';
  if (incomplete.length) status = 'BORRADOR_INCOMPLETO';
  if (blockers.length) status = 'BLOQUEADO';
  if (!incomplete.length && !blockers.length && reviews.length) status = 'LISTO_PARA_REVISION';

  return {
    status,
    finalizable: status === 'COMPLETO',
    rulesVersion: RULES_VERSION,
    legalYear: year,
    applicableMinimumDaily: minDaily,
    incomplete,
    blockers,
    reviews,
    warnings,
  };
}
