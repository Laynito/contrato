# Contrato Individual de Trabajo V1 — Matriz legal y árbol de decisión

> Estado: **EN PROGRESO**. Base jurídica verificada el 23-08-2026.
>
> Alcance: México, relaciones regidas por el Apartado A del artículo 123 constitucional y la Ley Federal del Trabajo (LFT).

## 1. Fuentes oficiales base

1. **Ley Federal del Trabajo — texto vigente, última reforma DOF 14-05-2026**  
   Cámara de Diputados: https://www.diputados.gob.mx/LeyesBiblio/pdf/LFT.pdf
2. **Decreto LFT en materia de reducción de jornada laboral — DOF 01-05-2026**  
   Diario Oficial: https://dof.gob.mx/nota_detalle_popup.php?codigo=5786537
3. **Ley del Seguro Social — texto vigente, última reforma DOF 15-01-2026**  
   Cámara de Diputados: https://www.diputados.gob.mx/LeyesBiblio/pdf/LSS.pdf
4. **Ley Federal de Protección de Datos Personales en Posesión de los Particulares — ley vigente expedida DOF 20-03-2025, última reforma DOF 14-11-2025**  
   Cámara de Diputados: https://www.diputados.gob.mx/LeyesBiblio/pdf/LFPDPPP.pdf
5. **Constitución Política de los Estados Unidos Mexicanos — última reforma DOF 03-03-2026**  
   Cámara de Diputados: https://www.diputados.gob.mx/LeyesBiblio/ref/cpeum.htm
6. **Ley Federal de Protección a la Propiedad Industrial — última reforma DOF 03-04-2026**  
   Cámara de Diputados: https://www.diputados.gob.mx/LeyesBiblio/pdf/LFPPI.pdf
7. **Salarios mínimos vigentes a partir del 01-01-2026**  
   CONASAMI/STPS: https://www.gob.mx/conasami/es/articulos/se-publican-en-el-diario-oficial-de-la-federacion-los-salarios-minimos-vigentes-a-partir-del-1-de-enero-de-2026
8. **NOM-037-STPS-2023 — Teletrabajo, condiciones de seguridad y salud**  
   DOF: https://www.dof.gob.mx/nota_detalle.php?codigo=5691672&fecha=08/06/2023

## 2. Regla de versión 2026 sobre jornada

La LFT fue reformada el 01-05-2026 para establecer una jornada ordinaria máxima de 40 horas semanales en el artículo 59, **pero el decreto contiene una aplicación gradual**. Para 2026 el régimen transitorio conserva **48 horas semanales**; 2027: 46; 2028: 44; 2029: 42; 2030: 40.

Por tanto, el motor de reglas **no debe leer aisladamente el artículo 59**. Debe aplicar la tabla transitoria según la fecha de inicio/vigencia del contrato.

También existe gradualidad para trabajo extraordinario: 2026: 9 horas por semana; 2027: 9; 2028: 10; 2029: 11; 2030: 12. El artículo 66 reformado establece como régimen final hasta doce horas semanales, distribuibles hasta cuatro horas diarias en máximo cuatro días, pero en 2026 debe respetarse el transitorio de **9 horas**.

El decreto señala además que la reducción de jornada no puede implicar reducción de sueldo, salario o prestaciones.

**Clasificación:** `OBLIGATORIO POR LEY` + regla versionada por fecha.

## 3. Matriz legal V1

| Campo / tema | Clasificación | Regla V1 | Fuente principal | Pregunta sencilla al usuario | Notas / alertas |
|---|---|---|---|---|---|
| Nombre de trabajador y patrón | OBLIGATORIO POR LEY | Debe constar en el escrito | LFT art. 25-I | ¿Cuál es el nombre completo del trabajador y del patrón? | Si patrón es persona moral, validar razón social y representación |
| Nacionalidad | OBLIGATORIO POR LEY | Debe constar para ambas partes según art. 25-I | LFT art. 25-I | ¿Cuál es la nacionalidad? | No usar para discriminar |
| Edad | OBLIGATORIO POR LEY | Debe constar en el escrito | LFT art. 25-I | ¿Qué edad tiene el trabajador? | Activar reglas especiales si es menor de 18 |
| Sexo | OBLIGATORIO POR LEY | Art. 25-I lo incluye expresamente | LFT art. 25-I | ¿Qué sexo debe constar en el contrato? | Captura mínima; no usar para decisiones discriminatorias |
| Estado civil | OBLIGATORIO POR LEY | Art. 25-I lo incluye expresamente | LFT art. 25-I | ¿Cuál es el estado civil que debe constar? | Evitar usarlo para decisiones laborales |
| CURP | OBLIGATORIO POR LEY | Debe constar en el escrito | LFT art. 25-I | ¿Cuál es la CURP del trabajador? | Validar formato, no inferir datos sensibles adicionales |
| RFC | OBLIGATORIO POR LEY | Debe constar en el escrito | LFT art. 25-I | ¿Cuál es el RFC del trabajador y, en su caso, del patrón? | Permitir borrador incompleto, pero no marcar contrato final como completo si falta un dato legal requerido |
| Domicilio de trabajador y patrón | OBLIGATORIO POR LEY | Debe constar en el escrito | LFT art. 25-I | ¿Cuál es el domicilio de cada parte? | Distinguir domicilio de parte vs. lugar de trabajo |
| Tipo/duración de la relación | OBLIGATORIO POR LEY | Debe señalar obra, determinado, temporada, capacitación inicial o indeterminado; en su caso prueba | LFT arts. 25-II y 35 | ¿La necesidad de trabajo es permanente, temporal, por temporada o para una obra específica? | Si no hay estipulación expresa, la relación se presume indeterminada |
| Servicio / funciones | OBLIGATORIO POR LEY | Determinar con la mayor precisión posible | LFT art. 25-III | ¿Qué trabajo realizará la persona? | Evitar descripciones excesivamente abiertas |
| Lugar(es) de trabajo | OBLIGATORIO POR LEY | Debe constar | LFT art. 25-IV | ¿Dónde realizará normalmente el trabajo? | Si trabajo remoto supera 40%, activar teletrabajo |
| Duración de jornada | OBLIGATORIO POR LEY | Debe constar; aplicar régimen transitorio 2026 | LFT art. 25-V; arts. 58-68; transitorios DOF 01-05-2026 | ¿Qué días y horario ordinario tendrá? | En 2026 el máximo semanal transitorio general es 48 h |
| Horas extraordinarias | CONDICIONAL | No deben redactarse como obligación habitual del trabajador; aplicar límite temporal vigente | LFT arts. 66-68 + transitorio cuarto DOF 01-05-2026 | ¿El puesto prevé ocasionalmente tiempo extraordinario? | 2026 y 2027: hasta 9 h semanales conforme al transitorio; registrar/pagar conforme a ley, nunca convertirlas en jornada ordinaria encubierta |
| Forma y monto del salario | OBLIGATORIO POR LEY | Debe constar | LFT art. 25-VI; arts. 82-86 | ¿Cuánto se pagará y cómo se calcula? | Validar mínimo general/profesional según fecha y zona |
| Zona salarial | CONDICIONAL / REGLA AUTOMÁTICA | Determinar por lugar de prestación del servicio | Resolución CONASAMI 2026 | ¿En qué municipio se prestará principalmente el trabajo? | No preguntar al usuario qué salario mínimo aplica; el sistema debe resolverlo geográficamente |
| Salario mínimo 2026 — zona general | OBLIGATORIO COMO VALIDACIÓN | No permitir salario inferior al mínimo aplicable | CONASAMI 2026 | Sin pregunta adicional | $315.04 MXN por jornada diaria desde 01-01-2026, sujeto a salarios profesionales superiores cuando correspondan |
| Salario mínimo 2026 — ZLFN | OBLIGATORIO COMO VALIDACIÓN | No permitir salario inferior al mínimo aplicable | CONASAMI 2026 | Sin pregunta adicional | $440.87 MXN por jornada diaria desde 01-01-2026; para Tijuana debe evaluarse ZLFN y salario profesional si procede |
| Día y lugar/forma de pago | OBLIGATORIO POR LEY | Debe constar | LFT art. 25-VII; art. 88 | ¿Cada cuándo y por qué medio se pagará? | Plazo máximo: semanal para trabajo material; 15 días para los demás |
| Capacitación/adiestramiento | OBLIGATORIO POR LEY EN EL ESCRITO | El contrato debe indicar capacitación/adiestramiento conforme a planes/programas aplicables | LFT art. 25-VIII | ¿La empresa cuenta con plan o esquema de capacitación aplicable? | No confundir con relación de capacitación inicial de arts. 39-B y ss. |
| Días de descanso | OBLIGATORIO POR LEY | Deben reflejarse como condiciones de trabajo | LFT art. 25-IX; arts. 69-75 | ¿Qué día será el descanso semanal? | Aplicar reglas vigentes según jornada y fecha |
| Vacaciones | OBLIGATORIO POR LEY | Incluir condición conforme a mínimos legales | LFT arts. 25-IX, 76-81 | ¿La relación inicia desde cero o existe antigüedad reconocida? | Mínimo 12 días al superar un año; escala por antigüedad |
| Prima vacacional | OBLIGATORIO POR LEY | Mínimo 25% sobre salarios del periodo vacacional | LFT art. 80 | No preguntar porcentaje si se usará mínimo legal; preguntar sólo si será superior | Regla calculable |
| Aguinaldo | OBLIGATORIO POR LEY | Mínimo 15 días de salario, proporcional si no completa año | LFT art. 87 | ¿La empresa otorgará sólo el mínimo legal o una prestación superior? | No debe omitirse por informalidad |
| Beneficiarios | OBLIGATORIO POR LEY EN EL ESCRITO | Designar beneficiarios para salarios/prestaciones devengadas no cobradas y supuestos del art. 501 | LFT art. 25-X | ¿A quién designa como beneficiario(s) para los efectos legales aplicables? | Diseñar captura clara y actualizable |
| IMSS / seguridad social | CONDICIONAL EN EL DOCUMENTO; OBLIGACIÓN LEGAL EXTERNA | La inscripción al IMSS es obligación patronal; no es un campo textual general del art. 25 | LSS art. 15-I; LFT arts. 39-A a 39-C | ¿El trabajador ya fue dado de alta o está pendiente? | Nunca presentar “sin IMSS” como renuncia válida; puede quedar como estado operativo, no como exención |
| Porcentaje de trabajo remoto | CONDICIONAL | Más del 40% en domicilio del trabajador o lugar elegido activa Capítulo XII Bis de teletrabajo | LFT art. 330-A | ¿Qué porcentaje aproximado de la semana trabajará fuera del centro de trabajo desde su domicilio o lugar elegido? | Ocasional/esporádico no se considera teletrabajo; no inferir sólo por decir “híbrido” |
| Equipo e insumos de teletrabajo | OBLIGATORIO SI TELETRABAJO | El contrato debe identificar equipo e insumos entregados | LFT art. 330-B-IV | ¿Qué equipo e insumos proporcionará el patrón? | Debe armonizarse con inventario/registro de insumos y NOM-037 |
| Servicios de domicilio por teletrabajo | OBLIGATORIO SI TELETRABAJO | Describir monto que pagará el patrón por servicios relacionados | LFT art. 330-B-V y 330-E-III | ¿Qué monto o fórmula cubrirá telecomunicaciones y la parte proporcional de electricidad? | No dejar cláusula genérica que traslade todos los costos al trabajador |
| Contacto y supervisión en teletrabajo | OBLIGATORIO SI TELETRABAJO | Deben constar mecanismos de contacto/supervisión y horarios | LFT art. 330-B-VI, 330-I | ¿Qué medios se usarán para contacto y supervisión? | Supervisión proporcional; cámaras/micrófonos sólo extraordinariamente o por naturaleza de funciones |
| Derecho a desconexión | OBLIGATORIO SI TELETRABAJO | Debe respetarse al término de la jornada | LFT art. 330-E-VI; NOM-037 | Sin pregunta si se usa mínimo legal | Conviene cláusula expresa + política de teletrabajo |
| Reversibilidad teletrabajo/presencial | CONDICIONAL | Si hay cambio presencial→teletrabajo, debe ser voluntario y por escrito; puede pactarse reversibilidad | LFT art. 330-G | ¿La persona inicia en teletrabajo o está migrando desde modalidad presencial? | Diseñar mecanismo y tiempos de retorno cuando aplique |
| Seguridad y salud en teletrabajo | OBLIGACIÓN EXTERNA + ANEXO/POLÍTICA | Aplicar NOM-037 y verificar condiciones del lugar de trabajo | LFT art. 330-J; NOM-037-STPS-2023 | ¿Cuál será el lugar o lugares acordados para teletrabajo? | No intentar resolver toda NOM-037 en una cláusula del contrato |
| Aviso de privacidad laboral | OBLIGATORIO COMO CUMPLIMIENTO DE DATOS; NO NECESARIAMENTE CLÁUSULA CENTRAL | Informar identidad/domicilio del responsable, datos tratados, finalidades, medios de limitación y mecanismos ARCO | LFPDPPP arts. 14-16 | ¿El patrón ya cuenta con aviso de privacidad laboral? | Mejor como documento/flujo anexo; la ley vigente fue expedida en 2025 |
| Datos personales sensibles | CONDICIONAL | Sólo recabar si es necesario y con reglas reforzadas; consentimiento expreso y por escrito cuando aplique | LFPDPPP arts. 8-12 | ¿Existe una finalidad laboral/legal concreta que requiera este dato sensible? | Por defecto, no preguntar salud, biométricos u otros sensibles en el flujo general si no son necesarios |
| Derechos ARCO | OBLIGATORIO COMO MECANISMO DE PRIVACIDAD | Debe existir procedimiento para acceso, rectificación, cancelación y oposición | LFPDPPP arts. 21-28 | Sin pregunta al trabajador para generar contrato | Debe quedar en aviso/procedimiento, no como renuncia contractual |
| Seguridad de datos | OBLIGACIÓN EXTERNA | Mantener medidas administrativas, técnicas y físicas; deber de confidencialidad sobre datos persiste | LFPDPPP arts. 18-20 | Sin pregunta contractual directa | Especialmente relevante si plataforma almacena expedientes y contratos |
| Confidencialidad laboral general | RECOMENDADO / CONDICIONAL | Puede proteger información realmente confidencial y obligaciones legítimas durante la relación | LFPPI arts. 163-166; LFT obligaciones aplicables | ¿El puesto tendrá acceso a información comercial/técnica verdaderamente confidencial? | Definir categorías concretas; no declarar “todo” secreto industrial |
| Secreto industrial | CONDICIONAL | Para recibir protección debe ser información industrial/comercial confidencial con ventaja competitiva/económica y medidas suficientes de resguardo | LFPPI art. 163 | ¿A qué secretos industriales concretos tendrá acceso el puesto? | La empresa debe adoptar medidas reales de confidencialidad/acceso restringido |
| No divulgación de secreto industrial | CONDICIONAL | Quien accede por trabajo y fue prevenido de la confidencialidad debe abstenerse de divulgar sin consentimiento | LFPPI art. 166 | Sin pregunta adicional si ya se identificaron secretos | Base más sólida que una prohibición genérica de trabajar para competidores |
| No competencia post-empleo | REQUIERE REVISIÓN ESPECIAL | No incluir por defecto una prohibición amplia de trabajar/competir después de terminar la relación | CPEUM art. 5 + análisis especializado | ¿Existe un riesgo excepcional que no pueda cubrirse con confidencialidad/secreto industrial? | Priorizar NDA/secreto industrial. Cualquier restricción post-empleo debe revisión jurídica específica; no copiar cláusulas estadounidenses |

## 4. Árbol de decisión — V1

```text
¿Existe una relación de trabajo personal subordinado mediante salario?
  └─ NO -> Fuera del flujo de contrato laboral V1; revisar otra figura.
  └─ SÍ -> continuar.

¿La necesidad de trabajo es permanente/ordinaria?
  └─ SÍ -> TIEMPO INDETERMINADO (regla por defecto, LFT art. 35)
  └─ NO -> ¿La naturaleza del trabajo exige una obra específica?
          └─ SÍ -> OBRA DETERMINADA (art. 36)
          └─ NO -> ¿La naturaleza del trabajo exige duración temporal
                   o se sustituye temporalmente a otra persona?
                  └─ SÍ -> TIEMPO DETERMINADO (art. 37; documentar causa)
                  └─ NO -> ¿Es una necesidad fija y periódica/discontinua?
                          └─ SÍ -> TEMPORADA / INDETERMINADO DISCONTINUO (art. 39-F)
                          └─ NO -> TIEMPO INDETERMINADO

Si relación indeterminada o mayor de 180 días:
  ¿Se requiere verificar conocimientos/requisitos?
    └─ SÍ -> puede evaluarse PERIODO A PRUEBA (art. 39-A), por escrito y con seguridad social.

¿La finalidad inicial real es adquirir conocimientos/habilidades para el puesto?
  └─ SÍ -> evaluar CAPACITACIÓN INICIAL (arts. 39-B a 39-E), por escrito y con seguridad social.

¿La persona trabajará fuera del centro desde su domicilio/lugar elegido?
  └─ NO -> modalidad presencial ordinaria.
  └─ SÍ -> ¿Será más del 40% del tiempo?
          └─ SÍ -> activar TELETRABAJO: contrato con campos 330-B + obligaciones 330-E + NOM-037.
          └─ NO -> no activar automáticamente Capítulo XII Bis; registrar esquema híbrido y revisar reglas operativas aplicables.

Con lugar principal de trabajo y fecha:
  -> resolver zona salarial automáticamente
  -> resolver salario mínimo general/profesional vigente
  -> resolver máximo semanal de jornada por año
  -> resolver máximo semanal de horas extraordinarias por año
```

### Guardas obligatorias

- Nunca ofrecer `tiempo determinado` sólo porque el patrón “prefiere probar primero”.
- Periodo a prueba y capacitación inicial son figuras distintas.
- Periodo a prueba/capacitación inicial deben constar por escrito y garantizar seguridad social; de lo contrario operan las consecuencias del art. 39-C.
- No pueden aplicarse de manera simultánea o sucesiva al mismo trabajador en los supuestos prohibidos por el art. 39-D.
- Si termina el periodo a prueba/capacitación y continúa la relación, se considera indeterminada y el tiempo cuenta para antigüedad (art. 39-E).
- No preguntar al usuario “¿quieres aplicar 40 o 48 horas?”: la fecha determina la regla transitoria.
- No preguntar al usuario “¿qué salario mínimo te corresponde?”: ubicación, ocupación y fecha determinan la validación.
- No llamar “teletrabajo” automáticamente a cualquier día de home office: verificar el umbral legal de más del 40% y excluir trabajo ocasional/esporádico.
- No usar una cláusula genérica de no competencia como sustituto de una política correcta de confidencialidad y secretos industriales.
- No insertar consentimiento amplio para tratamiento de cualquier dato personal; la finalidad y necesidad deben estar delimitadas.

## 5. Reglas específicas cerradas en esta pasada

### 5.1 Salario mínimo y Tijuana

Para 2026:

- Zona del Salario Mínimo General: **$315.04 MXN diarios**.
- Zona Libre de la Frontera Norte: **$440.87 MXN diarios**.

El generador debe guardar una tabla versionada por vigencia y municipio, además de la tabla de salarios mínimos profesionales. En Tijuana el flujo debe evaluar ZLFN automáticamente.

### 5.2 Teletrabajo

El Capítulo XII Bis se activa cuando la relación se desarrolla **más del 40% del tiempo** en el domicilio de la persona trabajadora o en el domicilio elegido por ésta. El trabajo ocasional o esporádico no se considera teletrabajo para ese capítulo.

Cuando se activa, el contrato requiere, además de art. 25: equipo/insumos, pago de servicios relacionados, mecanismos de contacto/supervisión y distribución de horarios. El patrón debe asumir costos derivados, incluyendo telecomunicaciones y parte proporcional de electricidad cuando corresponda; mantener equipos; preservar seguridad de información; respetar desconexión; inscribir a seguridad social y capacitar.

La NOM-037 agrega un plano de cumplimiento de seguridad y salud, política de teletrabajo, lugares acordados, ergonomía, conectividad, riesgos y desconexión. **No debe comprimirse toda esta obligación dentro del contrato base**: se requiere anexo/política/checklist cuando aplique.

### 5.3 Privacidad y ARCO

La ley vigente de particulares es la expedida el 20-03-2025, no la ley histórica de 2010 (abrogada). El producto debe tratar el aviso de privacidad como documento/flujo relacionado, con al menos los elementos del art. 15 y mecanismo ARCO conforme a los arts. 21-28.

Para el MVP: recabar sólo datos necesarios para la relación/contrato; identificar sensibles; evitar preguntas sensibles por defecto; separar consentimiento cuando jurídicamente sea exigible; y aplicar medidas de seguridad al expediente laboral y documentos generados.

### 5.4 Confidencialidad vs. no competencia

La LFPPI vigente define y protege secretos industriales cuando existe información comercial/industrial confidencial que genera ventaja competitiva/económica y el titular adopta medidas suficientes para restringir acceso. La persona que por su empleo accede a un secreto y ha sido prevenida de su confidencialidad debe abstenerse de divulgarlo sin autorización.

Por ello, V1 debe priorizar:

1. identificar información verdaderamente confidencial;
2. delimitar secretos industriales cuando proceda;
3. imponer deber de no divulgación/uso indebido;
4. mantener medidas reales de acceso restringido.

Una prohibición general de trabajar para cualquier competidor después de la separación **no será cláusula automática**. Se clasifica `REQUIERE REVISIÓN ESPECIAL` por su tensión con la libertad de trabajo del artículo 5 constitucional y por depender del alcance concreto.

## 6. Casos especiales todavía abiertos

- Menores de edad: reglas especiales y restricciones.
- Trabajo del campo, plataformas digitales, personas trabajadoras del hogar, artistas y otros trabajos especiales: no deben entrar silenciosamente al contrato general V1.
- Trabajo fuera de México contratado en territorio nacional: art. 28 y requisitos adicionales.
- Salarios mínimos profesionales: integrar catálogo 2026 al motor de validación.
- Propiedad intelectual/derechos de autor de obras creadas durante la relación: requiere pasada específica.
- Tratamiento de biométricos, expedientes médicos, evaluaciones automatizadas de personal y otros datos sensibles: flujo separado/especial.

## 7. Próxima investigación

1. Menores y trabajos especiales para definir exclusiones/derivaciones del V1.
2. Propiedad intelectual laboral y obras creadas por trabajadores.
3. Salarios mínimos profesionales 2026 y regla de selección por ocupación.
4. Campos que pueden quedar `PENDIENTE / NO PROPORCIONADO` durante borrador vs. campos que impiden marcar contrato final como completo.
5. Convertir esta matriz jurídica en especificación del cuestionario, sin programar todavía la aplicación.
