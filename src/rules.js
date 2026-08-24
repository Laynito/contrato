import {
  DAILY_HOURS_BY_SHIFT,
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
  ['employer.nationality', 'Nacionalidad del patrón'],
  ['employer.rfc', 'RFC del patrón'],
  ['employer.address', 'Domicilio del patrón'],
  ['worker.name', 'Nombre de la persona trabajadora'],
  ['worker.address', 'Domicilio de la persona trabajadora'],
  ['worker.birthDate', 'Fecha de nacimiento/edad'],
  ['worker.nationality', 'Nacionalidad'],
  ['worker.sex', 'Sexo'],
  ['worker.civilStatus', 'Estado civil'],
  ['worker.curp', 'CURP'],
  ['worker.rfc', 'RFC'],
  ['worker.beneficiaries', 'Beneficiarios'],
  ['job.title', 'Puesto'],
  ['job.description', 'Descripción de los servicios'],
  ['job.workplace', 'Lugar de trabajo'],
  ['job.municipality', 'Municipio principal de trabajo'],
  ['relation.type', 'Tipo de relación'],
  ['relation.startDate', 'Fecha de inicio'],
  ['schedule.shiftType', 'Tipo de jornada'],
  ['schedule.dailyHours', 'Horas ordinarias diarias'],
  ['schedule.weeklyHours', 'Horas ordinarias semanales'],
  ['schedule.workDaysCount', 'Días de trabajo por semana'],
  ['schedule.weeklyRestDay', 'Día de descanso semanal'],
  ['schedule.startTime', 'Hora de inicio'],
  ['schedule.endTime', 'Hora de fin'],
  ['salary.daily', 'Salario diario'],
  ['salary.paymentMethod', 'Forma de pago'],
  ['salary.paymentFrequency', 'Periodicidad de pago'],
  ['benefits.aguinaldoDays', 'Días de aguinaldo'],
  ['benefits.vacationDays', 'Días de vacaciones'],
  ['benefits.vacationPremiumPercent', 'Prima vacacional'],
];

const VALID_TEMPORARY_CAUSES = new Set(['SUSTITUCION_TEMPORAL', 'NATURALEZA_TEMPORAL', 'OTRA_CAUSA_REVISADA']);
function getPath(o,p){return p.split('.').reduce((v,k)=>v?.[k],o)}
function hasValue(v){if(Array.isArray(v))return v.length>0;return v!==undefined&&v!==null&&String(v).trim()!==''}
function ageOn(d,at=new Date()){const b=new Date(`${d}T00:00:00Z`);if(Number.isNaN(b.getTime()))return null;let a=at.getUTCFullYear()-b.getUTCFullYear();const m=at.getUTCMonth()-b.getUTCMonth();if(m<0||(m===0&&at.getUTCDate()<b.getUTCDate()))a--;return a}
function looksVague(t){return /cualquier\s+(actividad|trabajo|tarea)|lo\s+que\s+(ordene|indique)\s+el\s+patr[oó]n|trabajos?\s+varios\s+seg[uú]n\s+se\s+necesiten/.test(String(t||'').toLowerCase())}
function minutes(t){const m=String(t||'').match(/^(\d{2}):(\d{2})$/);if(!m)return null;const h=Number(m[1]),min=Number(m[2]);return h<=23&&min<=59?h*60+min:null}
function hoursFromTimes(start,end,breakMinutes=0){const s=minutes(start),e0=minutes(end);if(s===null||e0===null)return null;let e=e0;if(e<=s)e+=1440;return Math.max(0,(e-s-Number(breakMinutes||0))/60)}
function normalized(t){return String(t||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim().toLowerCase()}

export function applicableMinimumDaily(input){const zone=input?.salary?.zone==='ZLFN'?'zlfn':'general';return Math.max(MINIMUM_WAGE_2026[zone],Number(input?.salary?.professionalMinimumDaily||0))}

export function evaluateContract(input,now=new Date()){
  const incomplete=[],blockers=[],reviews=[],warnings=[];const year=Number(input?.legalYear||now.getUTCFullYear());
  for(const[path,label]of REQUIRED)if(!hasValue(getPath(input,path)))incomplete.push({code:`MISSING_${path.toUpperCase().replaceAll('.','_')}`,message:`Falta ${label}.`});
  if(input?.employer?.legalEntity&&!hasValue(input?.employer?.representative))incomplete.push({code:'MISSING_EMPLOYER_REPRESENTATIVE',message:'Si el patrón es persona moral, falta identificar a quien firma en su representación.'});

  const type=input?.relation?.type;
  if(hasValue(type)&&!RELATION_TYPES.includes(type))blockers.push({code:'RELATION_TYPE_INVALID',message:'El tipo de relación no pertenece al catálogo jurídico V1.'});
  if(type==='DETERMINADO'){
    if(!hasValue(input?.relation?.temporaryCause)||!VALID_TEMPORARY_CAUSES.has(input?.relation?.temporaryCauseCategory))blockers.push({code:'FIXED_TERM_WITHOUT_CAUSE',message:'La relación por tiempo determinado requiere una causa jurídica documentada y clasificada; la mera preferencia patronal no basta.'});
    if(input?.relation?.temporaryCauseCategory==='OTRA_CAUSA_REVISADA')reviews.push({code:'FIXED_TERM_OTHER_CAUSE_REVIEW',message:'La causa temporal seleccionada requiere revisión especial antes de emisión.'});
  }
  if(type==='OBRA'&&(!hasValue(input?.relation?.workDescription)||looksVague(input?.relation?.workDescription)))blockers.push({code:'WORK_TERM_WITHOUT_WORK',message:'La relación por obra determinada requiere identificar una obra concreta y verificable.'});
  if(type==='TEMPORADA'&&!hasValue(input?.relation?.seasonDescription))blockers.push({code:'SEASON_WITHOUT_DESCRIPTION',message:'La relación de temporada requiere describir el periodo o actividad estacional.'});
  if(['PRUEBA','CAPACITACION_INICIAL'].includes(type)&&input?.relation?.priorTrainingOrTrial)blockers.push({code:'TRIAL_TRAINING_CHAINED',message:'El flujo V1 no concatena capacitación inicial y periodo a prueba para la misma relación/puesto.'});
  if(type==='PRUEBA'&&input?.relation?.continuesAfterTrial)blockers.push({code:'TRIAL_CONTINUITY_REQUIRES_INDEFINITE',message:'Si la prestación continúa después del periodo a prueba, el flujo debe continuar como relación por tiempo indeterminado y conservar antigüedad.'});

  if(looksVague(input?.job?.description))blockers.push({code:'JOB_DESCRIPTION_TOO_VAGUE',message:'La descripción de servicios es demasiado abierta; debe precisar razonablemente las funciones.'});
  if(normalized(input?.job?.municipality)==='tijuana'&&input?.salary?.zone!=='ZLFN')blockers.push({code:'TIJUANA_REQUIRES_ZLFN',message:'Tijuana debe validarse con el salario de la Zona Libre de la Frontera Norte.'});

  const maxWeekly=WEEKLY_HOURS_BY_YEAR[year];if(!maxWeekly)reviews.push({code:'YEAR_RULES_NOT_VERSIONED',message:`No hay reglas de jornada versionadas para ${year}.`});
  const weekly=Number(input?.schedule?.weeklyHours||0);if(maxWeekly&&weekly>maxWeekly)blockers.push({code:'WEEKLY_HOURS_EXCEEDED',message:`La jornada propuesta excede el máximo semanal versionado para ${year} (${maxWeekly} h).`});
  const shift=input?.schedule?.shiftType,daily=Number(input?.schedule?.dailyHours||0),dailyMax=DAILY_HOURS_BY_SHIFT[shift];
  if(hasValue(shift)&&!dailyMax)blockers.push({code:'SHIFT_TYPE_INVALID',message:'El tipo de jornada no es DIURNA, NOCTURNA o MIXTA.'});
  if(dailyMax&&daily>dailyMax)blockers.push({code:'DAILY_HOURS_EXCEEDED',message:`La jornada ${shift.toLowerCase()} excede su máximo diario de ${dailyMax} horas.`});
  const days=Number(input?.schedule?.workDaysCount||0);if(days>6)blockers.push({code:'WEEKLY_REST_MISSING',message:'Debe existir por lo menos un día de descanso por cada seis días de trabajo.'});
  const calculated=hoursFromTimes(input?.schedule?.startTime,input?.schedule?.endTime,input?.schedule?.breakMinutes||0);
  if(calculated!==null&&hasValue(input?.schedule?.dailyHours)&&Math.abs(calculated-daily)>0.26)blockers.push({code:'SCHEDULE_HOURS_CONTRADICTION',message:`El horario capturado equivale aproximadamente a ${calculated.toFixed(2)} horas y contradice las horas diarias declaradas.`});
  if(days&&daily&&weekly>daily*days+0.26)blockers.push({code:'WEEKLY_DAILY_HOURS_CONTRADICTION',message:'Las horas semanales declaradas exceden las horas diarias multiplicadas por los días de trabajo capturados.'});

  const overtime=Number(input?.schedule?.plannedOvertimeHours||0),maxOver=WEEKLY_OVERTIME_BY_YEAR[year];if(maxOver!==undefined&&overtime>maxOver)blockers.push({code:'OVERTIME_EXCEEDED',message:`Las horas extraordinarias propuestas exceden el máximo transitorio para ${year} (${maxOver} h).`});

  const dailySalary=Number(input?.salary?.daily||0),minDaily=applicableMinimumDaily(input);if(hasValue(input?.salary?.daily)&&dailySalary<minDaily)blockers.push({code:'SALARY_BELOW_MINIMUM',message:`El salario diario ($${dailySalary.toFixed(2)}) es inferior al mínimo aplicable ($${minDaily.toFixed(2)}).`});
  if(input?.salary?.professionalClassification==='AMBIGUOUS')reviews.push({code:'PROFESSIONAL_MINIMUM_AMBIGUOUS',message:'Las funciones podrían corresponder a una ocupación con salario mínimo profesional; debe clasificarse antes de emitir.'});
  const freq=input?.salary?.paymentFrequency;if(freq==='Mensual')blockers.push({code:'PAY_INTERVAL_TOO_LONG',message:'La periodicidad mensual excede el intervalo permitido por el flujo V1 conforme al art. 88.'});if(input?.job?.materialWork&&freq!=='Semanal')blockers.push({code:'MATERIAL_WORK_PAY_INTERVAL',message:'Para trabajo material, el flujo V1 exige periodicidad no mayor a una semana.'});

  if(hasValue(input?.benefits?.aguinaldoDays)&&Number(input.benefits.aguinaldoDays)<MINIMUM_BENEFITS.aguinaldoDays)blockers.push({code:'AGUINALDO_BELOW_MINIMUM',message:`El aguinaldo no puede ser inferior a ${MINIMUM_BENEFITS.aguinaldoDays} días.`});
  if(hasValue(input?.benefits?.vacationPremiumPercent)&&Number(input.benefits.vacationPremiumPercent)<MINIMUM_BENEFITS.vacationPremiumPercent)blockers.push({code:'VACATION_PREMIUM_BELOW_MINIMUM',message:`La prima vacacional no puede ser inferior a ${MINIMUM_BENEFITS.vacationPremiumPercent}%.`});
  if(hasValue(input?.benefits?.vacationDays)&&Number(input.benefits.vacationDays)<MINIMUM_BENEFITS.firstYearVacationDays)blockers.push({code:'VACATION_BELOW_FIRST_YEAR_MINIMUM',message:`Para el primer año, el flujo V1 no permite menos de ${MINIMUM_BENEFITS.firstYearVacationDays} días de vacaciones.`});

  const remote=Number(input?.telework?.percent||0);if(input?.modality?.presential100&&remote>0)blockers.push({code:'WORK_MODALITY_CONTRADICTION',message:'No puede declararse 100% presencial y trabajo remoto simultáneamente.'});if(remote>40){if(!input?.telework?.equipmentDefined)blockers.push({code:'TELEWORK_EQUIPMENT_MISSING',message:'Teletrabajo >40% requiere definir equipo e insumos.'});if(!input?.telework?.costsDefined)blockers.push({code:'TELEWORK_COSTS_MISSING',message:'Teletrabajo >40% requiere definir costos proporcionales.'});if(!input?.telework?.disconnectDefined)blockers.push({code:'TELEWORK_DISCONNECT_MISSING',message:'Teletrabajo >40% requiere reconocer desconexión.'});if(!input?.telework?.supervisionDefined)blockers.push({code:'TELEWORK_SUPERVISION_MISSING',message:'Teletrabajo >40% requiere definir supervisión/contacto compatible con privacidad.'})}

  const age=input?.worker?.birthDate?ageOn(input.worker.birthDate,now):null;if(age!==null&&age<15)blockers.push({code:'UNDER_MINIMUM_WORKING_AGE',message:'El flujo V1 bloquea generación para menores de 15 años.'});if(age!==null&&age>=15&&age<18){reviews.push({code:SPECIAL_REVIEW_FLAGS[0],message:'Persona menor de 18 años: requiere revisión especial antes de emitir.'});if(overtime>0)blockers.push({code:'MINOR_OVERTIME_PROHIBITED',message:'Las personas menores de 18 años no deben tener tiempo extraordinario en este flujo.'})}
  if(input?.clauses?.postEmploymentNonCompete)reviews.push({code:SPECIAL_REVIEW_FLAGS[1],message:'La no competencia post-empleo requiere revisión especial.'});if(input?.specialWork)reviews.push({code:SPECIAL_REVIEW_FLAGS[2],message:'Trabajo especial: requiere flujo jurídico específico.'});
  if(input?.imss?.waiverAttempted)blockers.push({code:'IMSS_WAIVER_REJECTED',message:'El producto no admite renuncia o acuerdo para eliminar obligaciones de seguridad social.'});if(input?.imss?.provided===false)warnings.push({code:'IMSS_NOT_PROVIDED',message:'La ausencia de datos IMSS no elimina obligaciones legales externas del patrón.'});if(input?.privacy?.noticeStatus==='AVISO_PENDIENTE'||input?.privacy?.noticeStatus==='NO_INFORMADO')warnings.push({code:'PRIVACY_NOTICE_PENDING',message:'El aviso de privacidad está pendiente/no informado; el contrato no sustituye esa obligación.'});

  let status='COMPLETO';if(incomplete.length)status='BORRADOR_INCOMPLETO';if(blockers.length)status='BLOQUEADO';if(!incomplete.length&&!blockers.length&&reviews.length)status='LISTO_PARA_REVISION';
  return{status,finalizable:status==='COMPLETO',rulesVersion:RULES_VERSION,legalYear:year,applicableMinimumDaily:minDaily,incomplete,blockers,reviews,warnings};
}
