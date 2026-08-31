import test from 'node:test';
import assert from 'node:assert/strict';
import { evaluateContract } from '../src/rules.js';

const NOW = new Date('2026-08-24T12:00:00Z');

function base(overrides = {}) {
  const value = {
    legalYear: 2026,
    employer: { name: 'Comercial Ejemplo SA de CV', nationality: 'Mexicana', rfc: 'CEJ260101AA1', address: 'Tijuana, Baja California', legalEntity: false, representative: '' },
    worker: { name: 'Persona Trabajadora', address: 'Tijuana, Baja California', birthDate: '1990-01-01', nationality: 'Mexicana', sex: 'Femenino', civilStatus: 'Soltera', curp: 'TEST900101MBCXXX01', rfc: 'TEST900101AA1', beneficiaries: 'Beneficiario Ejemplo, familiar' },
    job: { title: 'Auxiliar administrativo', description: 'Captura pedidos, integra expedientes y atiende consultas administrativas.', workplace: 'Tijuana, Baja California', municipality: 'Tijuana', materialWork: false },
    relation: { type: 'INDETERMINADO', startDate: '2026-08-24', temporaryCauseCategory: '', temporaryCause: '', workDescription: '', seasonDescription: '', priorTrainingOrTrial: false, continuesAfterTrial: false },
    schedule: { shiftType: 'DIURNA', dailyHours: 8, weeklyHours: 48, workDaysCount: 6, weeklyRestDay: 'Domingo', startTime: '09:00', endTime: '17:00', breakMinutes: 0, plannedOvertimeHours: 0 },
    salary: { daily: 500, zone: 'ZLFN', professionalClassification: 'NONE', professionalMinimumDaily: 0, paymentFrequency: 'Semanal', paymentMethod: 'Transferencia' },
    benefits: { aguinaldoDays: 15, vacationDays: 12, vacationPremiumPercent: 25 },
    modality: { presential100: false },
    telework: { percent: 0, equipmentDefined: false, costsDefined: false, disconnectDefined: false, supervisionDefined: false },
    imss: { provided: true, waiverAttempted: false },
    privacy: { noticeStatus: 'ENTREGADO' },
    clauses: { confidentiality: false, postEmploymentNonCompete: false },
    specialWork: false,
  };
  for (const [key, patch] of Object.entries(overrides)) value[key] = typeof patch === 'object' && patch !== null && !Array.isArray(patch) ? { ...value[key], ...patch } : patch;
  return value;
}

function expectStatus(input, status) { assert.equal(evaluateContract(input, NOW).status, status); }
function hasCode(result, group, code) { assert.ok(result[group].some((x) => x.code === code), `${code} missing in ${group}`); }

test('01 indeterminado ordinario válido en Tijuana', () => expectStatus(base(), 'COMPLETO'));
test('02 tiempo determinado por preferencia patronal se bloquea', () => expectStatus(base({ relation: { type: 'DETERMINADO', temporaryCause: 'Quiero probarlo tres meses', temporaryCauseCategory: '' } }), 'BLOQUEADO'));
test('03 sustitución temporal documentada puede continuar', () => expectStatus(base({ relation: { type: 'DETERMINADO', temporaryCause: 'Cubrir incapacidad temporal identificada', temporaryCauseCategory: 'SUSTITUCION_TEMPORAL' } }), 'COMPLETO'));
test('04 obra determinada sin obra identificable se bloquea', () => expectStatus(base({ relation: { type: 'OBRA', workDescription: 'trabajos varios según se necesiten' } }), 'BLOQUEADO'));
test('05 jornada 52h en 2026 se bloquea', () => expectStatus(base({ schedule: { weeklyHours: 52, plannedOvertimeHours: 4 } }), 'BLOQUEADO'));
test('06 horas extra ocasionales dentro del límite 2026 no bloquean', () => expectStatus(base({ schedule: { weeklyHours: 48, plannedOvertimeHours: 9 } }), 'COMPLETO'));
test('07 salario $400 en ZLFN se bloquea', () => expectStatus(base({ salary: { daily: 400 } }), 'BLOQUEADO'));
test('08 ocupación profesional ambigua requiere revisión', () => expectStatus(base({ salary: { professionalClassification: 'AMBIGUOUS' } }), 'LISTO_PARA_REVISION'));
test('09 RFC y beneficiarios faltantes dejan borrador incompleto', () => expectStatus(base({ worker: { rfc: '', beneficiaries: '' } }), 'BORRADOR_INCOMPLETO'));
test('10 intento de renuncia IMSS se bloquea', () => { const r=evaluateContract(base({ imss:{ provided:false, waiverAttempted:true } }),NOW); assert.equal(r.status,'BLOQUEADO'); hasCode(r,'blockers','IMSS_WAIVER_REJECTED'); });
test('11 teletrabajo 60% incompleto se bloquea', () => expectStatus(base({ telework: { percent: 60 } }), 'BLOQUEADO'));
test('12 híbrido 40% exacto no activa automáticamente teletrabajo especial', () => expectStatus(base({ telework: { percent: 40 } }), 'COMPLETO'));
test('13 trabajador de 17 años requiere revisión especial', () => expectStatus(base({ worker: { birthDate: '2009-01-01' } }), 'LISTO_PARA_REVISION'));
test('14 no competencia post-empleo requiere revisión', () => expectStatus(base({ clauses: { postEmploymentNonCompete: true } }), 'LISTO_PARA_REVISION'));
test('15 confidencialidad legítima es permitida', () => expectStatus(base({ clauses: { confidentiality: true } }), 'COMPLETO'));
test('16 prestación inferior al mínimo se bloquea', () => expectStatus(base({ benefits: { aguinaldoDays: 10, vacationPremiumPercent: 20 } }), 'BLOQUEADO'));
test('17 prestaciones superiores conservan contrato completo', () => expectStatus(base({ benefits: { aguinaldoDays: 30, vacationPremiumPercent: 35, vacationDays: 18 } }), 'COMPLETO'));
test('18 aviso de privacidad pendiente no se inventa como entregado', () => { const r=evaluateContract(base({ privacy:{ noticeStatus:'AVISO_PENDIENTE' } }),NOW); assert.equal(r.status,'COMPLETO'); hasCode(r,'warnings','PRIVACY_NOTICE_PENDING'); });
test('19 respuestas contradictorias de modalidad se bloquean', () => expectStatus(base({ modality:{ presential100:true }, telework:{ percent:60, equipmentDefined:true, costsDefined:true, disconnectDefined:true, supervisionDefined:true } }), 'BLOQUEADO'));
test('20 trabajo especial requiere revisión', () => expectStatus(base({ specialWork:true }), 'LISTO_PARA_REVISION'));
test('21 capacitación/prueba sucesivas se bloquean', () => expectStatus(base({ relation:{ type:'CAPACITACION_INICIAL', priorTrainingOrTrial:true } }), 'BLOQUEADO'));
test('22 continuidad posterior a prueba exige conversión a indeterminado', () => { const r=evaluateContract(base({ relation:{ type:'PRUEBA', continuesAfterTrial:true } }),NOW); assert.equal(r.status,'BLOQUEADO'); hasCode(r,'blockers','TRIAL_CONTINUITY_REQUIRES_INDEFINITE'); });
test('23 funciones excesivamente abiertas se bloquean', () => expectStatus(base({ job:{ description:'cualquier actividad que ordene el patrón' } }), 'BLOQUEADO'));
test('24 pago mensual a trabajador material se bloquea', () => { const r=evaluateContract(base({ job:{ materialWork:true }, salary:{ paymentFrequency:'Mensual' } }),NOW); assert.equal(r.status,'BLOQUEADO'); hasCode(r,'blockers','MATERIAL_WORK_PAY_INTERVAL'); });
test('25 faltantes del art. 25 conservan borrador y pendientes', () => { const input=base({ worker:{ rfc:'', beneficiaries:'' }, employer:{ address:'' } }); const r=evaluateContract(input,NOW); assert.equal(r.status,'BORRADOR_INCOMPLETO'); assert.ok(r.incomplete.length>=3); assert.equal(r.finalizable,false); });

test('regresión 2027: 9 horas extraordinarias permitidas, 10 bloqueadas', () => {
  assert.equal(evaluateContract(base({ legalYear:2027, schedule:{ weeklyHours:46, dailyHours:46/6, workDaysCount:6, startTime:'09:00', endTime:'16:40', plannedOvertimeHours:9 } }),NOW).status,'COMPLETO');
  const r=evaluateContract(base({ legalYear:2027, schedule:{ weeklyHours:46, dailyHours:46/6, workDaysCount:6, startTime:'09:00', endTime:'16:40', plannedOvertimeHours:10 } }),NOW);
  assert.equal(r.status,'BLOQUEADO'); hasCode(r,'blockers','OVERTIME_EXCEEDED');
});
test('jornada nocturna superior a 7 horas se bloquea',()=>{const r=evaluateContract(base({schedule:{shiftType:'NOCTURNA',dailyHours:8,startTime:'22:00',endTime:'06:00',weeklyHours:42,workDaysCount:6}}),NOW);assert.equal(r.status,'BLOQUEADO');hasCode(r,'blockers','DAILY_HOURS_EXCEEDED')});
test('horario contradictorio con horas declaradas se bloquea',()=>{const r=evaluateContract(base({schedule:{dailyHours:8,startTime:'09:00',endTime:'18:00',breakMinutes:0}}),NOW);assert.equal(r.status,'BLOQUEADO');hasCode(r,'blockers','SCHEDULE_HOURS_CONTRADICTION')});
test('Tijuana no puede usar zona salarial general',()=>{const r=evaluateContract(base({salary:{zone:'GENERAL',daily:500}}),NOW);assert.equal(r.status,'BLOQUEADO');hasCode(r,'blockers','TIJUANA_REQUIRES_ZLFN')});
