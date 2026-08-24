import crypto from 'node:crypto';
import { RULES_VERSION, TEMPLATE_VERSION } from './legal.js';

function safe(value, fallback='NO PROPORCIONADO'){const t=String(value??'').trim();return t||fallback}
function money(value){return Number(value||0).toLocaleString('es-MX',{style:'currency',currency:'MXN'})}
function ageFromBirthDate(date){const b=new Date(`${date}T00:00:00Z`);if(Number.isNaN(b.getTime()))return 'NO PROPORCIONADA';const n=new Date();let a=n.getUTCFullYear()-b.getUTCFullYear();if(n.getUTCMonth()<b.getUTCMonth()||(n.getUTCMonth()===b.getUTCMonth()&&n.getUTCDate()<b.getUTCDate()))a--;return String(a)}

export function renderContractText(payload,generatedAt=new Date().toISOString()){
  const telework=Number(payload?.telework?.percent||0),r=payload.relation||{},s=payload.schedule||{};
  const employerRep=payload?.employer?.legalEntity?` representada para este acto por ${safe(payload?.employer?.representative)}`:'';
  const clauses=[
    `PRIMERA. RELACIÓN DE TRABAJO. Las partes reconocen una relación de tipo ${safe(r.type)} que inicia el ${safe(r.startDate)}.`,
    r.type==='DETERMINADO'?`La causa documentada de la temporalidad es: ${safe(r.temporaryCause)}.`:'',
    r.type==='OBRA'?`La obra determinada consiste en: ${safe(r.workDescription)}.`:'',
    r.type==='TEMPORADA'?`La temporada o actividad estacional se describe como: ${safe(r.seasonDescription)}.`:'',
    `SEGUNDA. SERVICIOS. La persona trabajadora prestará servicios como ${safe(payload?.job?.title)} y realizará las siguientes funciones: ${safe(payload?.job?.description)}. El centro principal de trabajo será ${safe(payload?.job?.workplace)}, municipio de ${safe(payload?.job?.municipality)}.`,
    `TERCERA. JORNADA. Se pacta jornada ${safe(s.shiftType)}, de ${safe(s.dailyHours)} horas ordinarias diarias, ${safe(s.weeklyHours)} horas ordinarias semanales y ${safe(s.workDaysCount)} días de trabajo por semana. Horario de referencia: ${safe(s.startTime)} a ${safe(s.endTime)}, con ${safe(s.breakMinutes, '0')} minutos de descanso no computados en las horas capturadas cuando corresponda. El descanso semanal será el ${safe(s.weeklyRestDay)}. El tiempo extraordinario sólo procederá por circunstancias extraordinarias, dentro de límites legales y con el pago aplicable.`,
    `CUARTA. SALARIO. El salario diario pactado es ${money(payload?.salary?.daily)}, pagadero con periodicidad ${safe(payload?.salary?.paymentFrequency)} mediante ${safe(payload?.salary?.paymentMethod)}.`,
    `QUINTA. PRESTACIONES. Se reconocen ${safe(payload?.benefits?.aguinaldoDays)} días de aguinaldo, ${safe(payload?.benefits?.vacationDays)} días de vacaciones conforme al periodo capturado y prima vacacional de ${safe(payload?.benefits?.vacationPremiumPercent)}%. Los derechos superiores que resulten aplicables prevalecerán.`,
    `SEXTA. DESCANSOS, CAPACITACIÓN Y CONDICIONES. Se respetarán descansos obligatorios, capacitación/adiestramiento y demás condiciones conforme a la legislación vigente y a las condiciones más favorables aplicables.`,
    `SÉPTIMA. BENEFICIARIOS. La persona trabajadora designa para los efectos legales aplicables a: ${safe(payload?.worker?.beneficiaries)}.`,
    `OCTAVA. SEGURIDAD SOCIAL. Las obligaciones de seguridad social se regirán por la legislación aplicable. La falta de captura de datos de seguridad social no implica renuncia, sustitución ni liberación de obligaciones legales.`,
    telework>40?`NOVENA. TELETRABAJO. Más del 40% de la jornada se realiza fuera del centro de trabajo. Se reconocen equipo/insumos, costos proporcionales de telecomunicaciones/electricidad, mecanismos de contacto y supervisión compatibles con privacidad, y derecho a desconexión conforme a la información capturada y normativa aplicable.`:`NOVENA. MODALIDAD. La información capturada no activa por sí sola el régimen especial de teletrabajo por superar el 40% de la jornada.`,
    payload?.clauses?.confidentiality?`DÉCIMA. CONFIDENCIALIDAD. La persona trabajadora resguardará información confidencial y secretos industriales legítimamente protegidos conocidos por sus funciones, sin impedir derechos laborales, denuncias o comunicaciones protegidas por ley.`:`DÉCIMA. CONFIDENCIALIDAD. No se añadió una obligación especial distinta de los deberes legales aplicables.`,
    `DÉCIMA PRIMERA. DATOS PERSONALES. El tratamiento de datos personales se sujetará al aviso de privacidad correspondiente. Este contrato no sustituye dicho aviso ni los mecanismos ARCO.`,
    `DÉCIMA SEGUNDA. LEGISLACIÓN APLICABLE. Para lo no previsto se aplicarán la Constitución, la Ley Federal del Trabajo y demás disposiciones vigentes aplicables.`,
  ].filter(Boolean);
  return[
    'CONTRATO INDIVIDUAL DE TRABAJO','',
    `QUE CELEBRAN por una parte ${safe(payload?.employer?.name)}, nacionalidad ${safe(payload?.employer?.nationality)}, RFC ${safe(payload?.employer?.rfc)}, con domicilio en ${safe(payload?.employer?.address)}${employerRep}, a quien se denominará “EL PATRÓN”; y por la otra ${safe(payload?.worker?.name)}, edad ${ageFromBirthDate(payload?.worker?.birthDate)} años, nacionalidad ${safe(payload?.worker?.nationality)}, sexo ${safe(payload?.worker?.sex)}, estado civil ${safe(payload?.worker?.civilStatus)}, CURP ${safe(payload?.worker?.curp)}, RFC ${safe(payload?.worker?.rfc)} y domicilio en ${safe(payload?.worker?.address)}, a quien se denominará “LA PERSONA TRABAJADORA”.`,'',
    ...clauses.flatMap(c=>[c,'']),'FIRMAS','',
    '__________________________________','EL PATRÓN','',
    '__________________________________','LA PERSONA TRABAJADORA','',
    `Documento generado: ${generatedAt}`,`Versión de reglas: ${RULES_VERSION}`,`Versión de plantilla: ${TEMPLATE_VERSION}`,
  ].join('\n');
}

function asciiLatin(text){return String(text).normalize('NFKD').replace(/[\u0300-\u036f]/g,'').replace(/[“”]/g,'"').replace(/[‘’]/g,"'").replace(/[–—]/g,'-').replace(/[^\x20-\xFF\n]/g,'?')}
function escapePdf(text){return text.replace(/\\/g,'\\\\').replace(/\(/g,'\\(').replace(/\)/g,'\\)')}
function wrap(text,width=95){const out=[];for(const p of asciiLatin(text).split('\n')){if(!p){out.push('');continue}const words=p.split(/\s+/);let line='';for(const word of words){if(!line)line=word;else if(`${line} ${word}`.length<=width)line+=` ${word}`;else{out.push(line);line=word}}if(line)out.push(line)}return out}
export function makePdf(text){const lines=wrap(text),pages=[];for(let i=0;i<lines.length;i+=50)pages.push(lines.slice(i,i+50));if(!pages.length)pages.push(['']);const objects=[],pageIds=[],contentIds=[];let next=4;for(let i=0;i<pages.length;i++){pageIds.push(next++);contentIds.push(next++)}const fontId=next++;objects[1]='<< /Type /Catalog /Pages 2 0 R >>';objects[2]=`<< /Type /Pages /Kids [${pageIds.map(id=>`${id} 0 R`).join(' ')}] /Count ${pages.length} >>`;objects[3]='<< /Producer (Contrato MX) >>';for(let i=0;i<pages.length;i++){const pid=pageIds[i],cid=contentIds[i],stream=['BT',`/F1 9 Tf`,'50 790 Td','13 TL',...pages[i].map(line=>`(${escapePdf(line)}) Tj T*`),'ET'].join('\n');objects[pid]=`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 ${fontId} 0 R >> >> /Contents ${cid} 0 R >>`;objects[cid]=`<< /Length ${Buffer.byteLength(stream,'latin1')} >>\nstream\n${stream}\nendstream`}objects[fontId]='<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>';let pdf='%PDF-1.4\n%\xE2\xE3\xCF\xD3\n';const offsets=[0];for(let id=1;id<objects.length;id++){if(!objects[id])continue;offsets[id]=Buffer.byteLength(pdf,'latin1');pdf+=`${id} 0 obj\n${objects[id]}\nendobj\n`}const xref=Buffer.byteLength(pdf,'latin1');pdf+=`xref\n0 ${objects.length}\n0000000000 65535 f \n`;for(let id=1;id<objects.length;id++)pdf+=`${String(offsets[id]||0).padStart(10,'0')} 00000 n \n`;pdf+=`trailer\n<< /Size ${objects.length} /Root 1 0 R /Info 3 0 R >>\nstartxref\n${xref}\n%%EOF\n`;return Buffer.from(pdf,'latin1')}
export function snapshotFor(payload,evaluation,generatedAt=new Date().toISOString()){const text=renderContractText(payload,generatedAt);return{generatedAt,rulesVersion:RULES_VERSION,templateVersion:TEMPLATE_VERSION,answers:structuredClone(payload),evaluation:structuredClone(evaluation),renderedText:text,sha256:crypto.createHash('sha256').update(text).digest('hex')}}
