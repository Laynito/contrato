import crypto from 'node:crypto';
import { RULES_VERSION, TEMPLATE_VERSION } from './legal.js';

function safe(value, fallback = 'NO PROPORCIONADO') {
  const text = String(value ?? '').trim();
  return text || fallback;
}

function money(value) {
  return Number(value || 0).toLocaleString('es-MX', { style: 'currency', currency: 'MXN' });
}

export function renderContractText(payload, generatedAt = new Date().toISOString()) {
  const telework = Number(payload?.telework?.percent || 0);
  const relation = payload.relation || {};
  const clauses = [
    `PRIMERA. RELACIÓN DE TRABAJO. Las partes reconocen una relación de tipo ${safe(relation.type)} que inicia el ${safe(relation.startDate)}.`,
    relation.type === 'DETERMINADO' ? `La causa documentada de la temporalidad es: ${safe(relation.temporaryCause)}.` : '',
    relation.type === 'OBRA' ? `La obra determinada consiste en: ${safe(relation.workDescription)}.` : '',
    relation.type === 'TEMPORADA' ? `La temporada o actividad estacional se describe como: ${safe(relation.seasonDescription)}.` : '',
    `SEGUNDA. SERVICIOS. La persona trabajadora prestará servicios como ${safe(payload?.job?.title)}, principalmente en ${safe(payload?.job?.workplace)}.`,
    `TERCERA. JORNADA. La jornada pactada es de ${safe(payload?.schedule?.weeklyHours)} horas semanales. Las horas extraordinarias sólo procederán dentro de los límites legales aplicables y con el pago correspondiente.`,
    `CUARTA. SALARIO. El salario diario pactado es ${money(payload?.salary?.daily)}, pagadero con periodicidad ${safe(payload?.salary?.paymentFrequency)} mediante ${safe(payload?.salary?.paymentMethod)}.`,
    `QUINTA. PRESTACIONES. Se reconocen, como mínimo en este instrumento, ${safe(payload?.benefits?.aguinaldoDays)} días de aguinaldo, ${safe(payload?.benefits?.vacationDays)} días de vacaciones conforme al periodo capturado y prima vacacional de ${safe(payload?.benefits?.vacationPremiumPercent)}%. Cualquier derecho superior previsto por la ley o aplicable al caso prevalecerá.`,
    `SEXTA. DESCANSOS Y VACACIONES. Los descansos semanal y obligatorio, vacaciones y demás condiciones se otorgarán conforme a la legislación laboral vigente y a las condiciones más favorables que resulten aplicables.`,
    `SÉPTIMA. SEGURIDAD SOCIAL. Las obligaciones de seguridad social se regirán por la legislación aplicable. La falta de captura de datos de seguridad social en este documento no implica renuncia, sustitución ni liberación de obligaciones legales.`,
    telework > 40 ? `OCTAVA. TELETRABAJO. Las partes reconocen que más del 40% de la jornada se realiza fuera del centro de trabajo. El patrón proporcionará/mantendrá el equipo e insumos definidos, asumirá los costos proporcionales capturados de telecomunicaciones y electricidad, y respetará el derecho a la desconexión.` : `OCTAVA. MODALIDAD. La información capturada no activa el régimen especial de teletrabajo por superar el 40% de la jornada.`,
    payload?.clauses?.confidentiality ? `NOVENA. CONFIDENCIALIDAD. La persona trabajadora deberá resguardar información confidencial y secretos industriales legítimamente protegidos a los que tenga acceso por razón de sus funciones, sin impedir el ejercicio de derechos laborales ni denuncias o comunicaciones protegidas por la ley.` : `NOVENA. CONFIDENCIALIDAD. No se añadió una obligación especial de confidencialidad distinta de los deberes legales aplicables.`,
    `DÉCIMA. DATOS PERSONALES. El tratamiento de datos personales deberá sujetarse al aviso de privacidad correspondiente. Este contrato no sustituye dicho aviso ni el mecanismo para ejercer derechos ARCO.`,
    `DÉCIMA PRIMERA. LEGISLACIÓN APLICABLE. Para lo no previsto se aplicarán la Constitución Política de los Estados Unidos Mexicanos, la Ley Federal del Trabajo y demás disposiciones vigentes que resulten aplicables.`,
  ].filter(Boolean);

  return [
    'CONTRATO INDIVIDUAL DE TRABAJO',
    '',
    `QUE CELEBRAN por una parte ${safe(payload?.employer?.name)}, con domicilio en ${safe(payload?.employer?.address)}, a quien en lo sucesivo se denominará “EL PATRÓN”; y por la otra ${safe(payload?.worker?.name)}, con domicilio en ${safe(payload?.worker?.address)}, nacionalidad ${safe(payload?.worker?.nationality)}, sexo ${safe(payload?.worker?.sex)}, estado civil ${safe(payload?.worker?.civilStatus)}, CURP ${safe(payload?.worker?.curp)} y RFC ${safe(payload?.worker?.rfc)}, a quien se denominará “LA PERSONA TRABAJADORA”.`,
    '',
    ...clauses.flatMap((c) => [c, '']),
    'FIRMAS',
    '',
    '__________________________________',
    'EL PATRÓN',
    '',
    '__________________________________',
    'LA PERSONA TRABAJADORA',
    '',
    `Documento generado: ${generatedAt}`,
    `Versión de reglas: ${RULES_VERSION}`,
    `Versión de plantilla: ${TEMPLATE_VERSION}`,
  ].join('\n');
}

function asciiLatin(text) {
  return String(text).normalize('NFKD').replace(/[\u0300-\u036f]/g, '').replace(/[“”]/g, '"').replace(/[‘’]/g, "'").replace(/[–—]/g, '-').replace(/[^\x20-\xFF\n]/g, '?');
}

function escapePdf(text) {
  return text.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');
}

function wrap(text, width = 95) {
  const out = [];
  for (const paragraph of asciiLatin(text).split('\n')) {
    if (!paragraph) { out.push(''); continue; }
    const words = paragraph.split(/\s+/);
    let line = '';
    for (const word of words) {
      if (!line) line = word;
      else if (`${line} ${word}`.length <= width) line += ` ${word}`;
      else { out.push(line); line = word; }
    }
    if (line) out.push(line);
  }
  return out;
}

export function makePdf(text) {
  const lines = wrap(text);
  const pages = [];
  for (let i = 0; i < lines.length; i += 50) pages.push(lines.slice(i, i + 50));
  if (!pages.length) pages.push(['']);

  const objects = [];
  const pageObjectIds = [];
  const contentObjectIds = [];
  let nextId = 4;
  for (let i = 0; i < pages.length; i++) {
    pageObjectIds.push(nextId++);
    contentObjectIds.push(nextId++);
  }
  const fontId = nextId++;

  objects[1] = `<< /Type /Catalog /Pages 2 0 R >>`;
  objects[2] = `<< /Type /Pages /Kids [${pageObjectIds.map((id) => `${id} 0 R`).join(' ')}] /Count ${pages.length} >>`;
  objects[3] = `<< /Producer (Contrato MX) >>`;

  for (let i = 0; i < pages.length; i++) {
    const pid = pageObjectIds[i];
    const cid = contentObjectIds[i];
    const stream = ['BT', `/F1 9 Tf`, '50 790 Td', '13 TL', ...pages[i].map((line) => `(${escapePdf(line)}) Tj T*`), 'ET'].join('\n');
    objects[pid] = `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 ${fontId} 0 R >> >> /Contents ${cid} 0 R >>`;
    objects[cid] = `<< /Length ${Buffer.byteLength(stream, 'latin1')} >>\nstream\n${stream}\nendstream`;
  }
  objects[fontId] = `<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>`;

  let pdf = '%PDF-1.4\n%\xE2\xE3\xCF\xD3\n';
  const offsets = [0];
  for (let id = 1; id < objects.length; id++) {
    if (!objects[id]) continue;
    offsets[id] = Buffer.byteLength(pdf, 'latin1');
    pdf += `${id} 0 obj\n${objects[id]}\nendobj\n`;
  }
  const xref = Buffer.byteLength(pdf, 'latin1');
  pdf += `xref\n0 ${objects.length}\n0000000000 65535 f \n`;
  for (let id = 1; id < objects.length; id++) pdf += `${String(offsets[id] || 0).padStart(10, '0')} 00000 n \n`;
  pdf += `trailer\n<< /Size ${objects.length} /Root 1 0 R /Info 3 0 R >>\nstartxref\n${xref}\n%%EOF\n`;
  return Buffer.from(pdf, 'latin1');
}

export function snapshotFor(payload, evaluation, generatedAt = new Date().toISOString()) {
  const text = renderContractText(payload, generatedAt);
  return {
    generatedAt,
    rulesVersion: RULES_VERSION,
    templateVersion: TEMPLATE_VERSION,
    answers: structuredClone(payload),
    evaluation: structuredClone(evaluation),
    renderedText: text,
    sha256: crypto.createHash('sha256').update(text).digest('hex'),
  };
}
