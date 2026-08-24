# Contrato V1 — Casos especiales, menores y propiedad intelectual

> Estado: **EN PROGRESO / anexo jurídico de la matriz V1**. Verificado el 23-08-2026 con fuentes oficiales.

## 1. Menores de edad — derivación obligatoria

El flujo general no debe generar silenciosamente un contrato estándar cuando la persona trabajadora sea menor de 18 años. Debe activar una revisión especial y validar, como mínimo, edad, aptitud médica, horario, actividad y riesgos del puesto.

### Reglas mínimas

| Tema | Clasificación | Regla V1 | Fuente | Decisión de producto |
|---|---|---|---|---|
| Menor de 15 años | BLOQUEO / REQUIERE REVISIÓN ESPECIAL | No admitirlo al flujo laboral ordinario | CPEUM art. 123 A-III; LFT régimen de menores | Bloquear generación estándar y explicar que el caso no entra al V1 general |
| 15 a 17 años | REQUIERE REVISIÓN ESPECIAL | Activar régimen protector especial | LFT arts. 173-180 | No reutilizar sin más el cuestionario de adultos |
| Certificado médico | OBLIGATORIO SI 15-17 | Mayores de 15 y menores de 18 deben acreditar aptitud médica; sin ese requisito el patrón no puede utilizar sus servicios | LFT art. 174 | Campo/documento previo a estado “listo para firma” |
| Actividad peligrosa/insalubre | PROHIBIDO SI MENOR DE 18 | No permitir labores comprendidas en arts. 175-176 | LFT arts. 175-176 | Preguntar actividad real y derivar/bloquear si hay señal de riesgo |
| Trabajo después de 22:00 en establecimiento no industrial | PROHIBIDO SI MENOR DE 18 | No programar ese horario | LFT art. 175-I | Validación automática del horario |
| Horas extraordinarias | PROHIBIDO SI MENOR DE 18 | No incorporar esquema de horas extra | LFT art. 178 | Si el usuario selecciona horas extra, mostrar incompatibilidad |
| Domingo y descanso obligatorio | PROHIBIDO SI MENOR DE 18 | No programar trabajo en esos días en el contrato general | LFT art. 178 | Validar calendario |

### Jornada de menores

La versión oficial de la LFT consultada contiene en el artículo 177 la regla expresa de seis horas diarias para menores de dieciséis años, divididas en periodos máximos de tres horas con reposo intermedio de al menos una hora. Por existir iniciativas y reformas recientes sobre jornada y protección de menores, el motor futuro no debe codificar esta regla sin versión normativa por fecha. Antes de producción se debe revalidar el texto consolidado más reciente del artículo 177 contra DOF/Cámara de Diputados.

**Decisión V1:** cualquier trabajador menor de 18 se clasifica `REQUIERE REVISIÓN ESPECIAL`; el contrato estándar para adultos no se presenta como jurídicamente completo.

## 2. Propiedad intelectual creada durante la relación laboral

La propiedad intelectual no debe resolverse con una cláusula genérica de “todo pertenece al patrón”. Debe distinguir al menos obras protegidas por derecho de autor, secretos industriales y otros resultados sujetos a regímenes específicos.

### Obras protegidas por derecho de autor

La Ley Federal del Derecho de Autor, artículo 84, establece que cuando una obra se realiza como consecuencia de una relación laboral documentada mediante contrato individual de trabajo por escrito, **a falta de pacto en contrario** se presume que los derechos patrimoniales se dividen por partes iguales entre empleador y empleado.

Por ello:

- si el puesto puede crear software, diseños, fotografías, textos, ilustraciones, manuales, material audiovisual u otras obras, el cuestionario debe preguntar si esa creación forma parte de las funciones;
- la cláusula debe identificar el alcance del pacto sobre derechos patrimoniales de forma deliberada, no mediante una cesión universal ambigua;
- los derechos morales del autor no deben tratarse como si fueran libremente renunciables o transferibles;
- si la empresa necesita una asignación distinta al régimen supletorio del artículo 84, debe existir pacto escrito claro.

| Tema | Clasificación | Regla V1 | Fuente | Pregunta sencilla |
|---|---|---|---|---|
| Creación de obras en el puesto | CONDICIONAL | Detectar si las funciones incluyen creación protegible | LFDA art. 84 | ¿El puesto creará software, diseños, textos, fotos, videos, ilustraciones u otras obras? |
| Pacto sobre derechos patrimoniales | RECOMENDADO / CONDICIONAL | Si se desea una distribución distinta de la presunción legal, debe pactarse claramente | LFDA art. 84 | ¿La empresa necesita pactar por escrito quién ejercerá los derechos patrimoniales sobre esas obras? |
| Derechos morales | NO CONVIENE PRESENTAR COMO CESIÓN TOTAL | No redactar renuncia/transferencia genérica de derechos morales | LFDA régimen de derechos morales | Sin pregunta general; usar cláusula especializada |
| Software y obras técnicas | REQUIERE REVISIÓN SI ES MATERIAL PARA EL NEGOCIO | No asumir que una cláusula laboral corta resuelve todos los derechos de explotación | LFDA + contrato concreto | Derivar a módulo/cláusula especializada cuando sea central al puesto |

## 3. Confidencialidad y secreto industrial — regla de producto

La LFPPI exige algo más concreto que llamar “confidencial” a cualquier información. Para secreto industrial debe existir información industrial/comercial confidencial que represente ventaja competitiva o económica y respecto de la cual se hayan adoptado medidas suficientes para preservar confidencialidad y acceso restringido.

El artículo 166 obliga a quien, por su trabajo o empleo, accede a un secreto industrial y ha sido prevenido sobre su confidencialidad a abstenerse de divulgarlo sin consentimiento.

**Decisión V1:** usar confidencialidad/secreto industrial como mecanismo principal de protección. La no competencia post-empleo permanece `REQUIERE REVISIÓN ESPECIAL` por su tensión con la libertad de trabajo del artículo 5 constitucional. La SCJN ha reconocido que restricciones amplias o desproporcionadas a la posibilidad de trabajar pueden ser inválidas en otros contextos constitucionales; por ello no debe copiarse una cláusula estadounidense de non-compete.

## 4. Trabajos especiales — exclusión segura del V1 general

Antes de generar un contrato estándar, el cuestionario debe detectar si el caso entra a un régimen laboral especial. Como mínimo:

- personas trabajadoras del hogar;
- trabajo del campo;
- plataformas digitales;
- artistas, actores, músicos u otros supuestos especiales;
- deportistas profesionales;
- autotransporte y tripulaciones cuando aplique;
- trabajo fuera de México contratado en territorio nacional;
- menores de edad;
- teletrabajo >40% (no se excluye, pero activa módulo especial).

**Regla:** si el usuario identifica un régimen especial que todavía no tiene plantilla validada, devolver `REQUIERE REVISIÓN ESPECIAL` en lugar de forzar el contrato general.

## 5. Checklist de readiness jurídico pendiente

Para considerar el entregable jurídico V1 suficientemente cerrado antes de programar el generador:

- [x] Datos mínimos del escrito (art. 25).
- [x] Tipos de relación y árbol determinado/indeterminado/temporada/prueba/capacitación.
- [x] Jornada 2026-2030 y horas extraordinarias transitorias.
- [x] Salario mínimo general y ZLFN 2026.
- [x] Teletrabajo >40% y obligaciones asociadas.
- [x] IMSS como obligación externa que no puede “renunciarse” por cláusula.
- [x] Privacidad/ARCO y separación del aviso de privacidad.
- [x] Confidencialidad/secreto industrial y no competencia como revisión especial.
- [x] Menores: detección y derivación especial.
- [x] Propiedad intelectual laboral: regla base del art. 84 LFDA.
- [ ] Integrar catálogo oficial completo de salarios mínimos profesionales 2026 y regla ocupación→mínimo.
- [ ] Revalidar texto consolidado más reciente de LFT, especialmente artículos de menores, contra reformas posteriores a la versión PDF indexada.
- [ ] Convertir matriz jurídica a especificación de cuestionario/campos obligatorios, condicionales y bloqueantes.
- [ ] Definir exactamente qué campos pueden quedar `PENDIENTE / NO PROPORCIONADO` en borrador y cuáles impiden emitir estado “contrato final completo”.
- [ ] Redactar el contrato base sólo después de cerrar la especificación de preguntas y reglas.

## 6. Fuentes oficiales principales de esta pasada

- Ley Federal del Trabajo, Cámara de Diputados: https://www.diputados.gob.mx/LeyesBiblio/pdf/LFT.pdf
- Decreto de jornada laboral, DOF 01-05-2026: https://dof.gob.mx/nota_detalle_popup.php?codigo=5786537
- Ley Federal del Derecho de Autor, Cámara de Diputados: https://www.diputados.gob.mx/LeyesBiblio/pdf/LFDA.pdf
- Ley Federal de Protección a la Propiedad Industrial, Cámara de Diputados: https://www.diputados.gob.mx/LeyesBiblio/pdf/LFPPI.pdf
- Constitución, artículo 5 y 123: https://www.diputados.gob.mx/LeyesBiblio/pdf/CPEUM.pdf
