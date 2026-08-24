export const RULES_VERSION = 'MX-LFT-2026.2';
export const TEMPLATE_VERSION = 'CONTRATO-V1.0';

export const WEEKLY_HOURS_BY_YEAR = Object.freeze({
  2026: 48,
  2027: 46,
  2028: 44,
  2029: 42,
  2030: 40,
});

export const WEEKLY_OVERTIME_BY_YEAR = Object.freeze({
  2026: 9,
  2027: 9,
  2028: 10,
  2029: 11,
  2030: 12,
});

export const DAILY_HOURS_BY_SHIFT = Object.freeze({
  DIURNA: 8,
  NOCTURNA: 7,
  MIXTA: 7.5,
});

export const MINIMUM_WAGE_2026 = Object.freeze({
  general: 315.04,
  zlfn: 440.87,
});

export const MINIMUM_BENEFITS = Object.freeze({
  aguinaldoDays: 15,
  vacationPremiumPercent: 25,
  firstYearVacationDays: 12,
});

export const RELATION_TYPES = Object.freeze([
  'INDETERMINADO',
  'DETERMINADO',
  'OBRA',
  'TEMPORADA',
  'PRUEBA',
  'CAPACITACION_INICIAL',
]);

export const SPECIAL_REVIEW_FLAGS = Object.freeze([
  'MENOR_EDAD',
  'NO_COMPETENCIA_POST_EMPLEO',
  'TRABAJO_ESPECIAL',
]);
