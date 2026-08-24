# Contrato Individual de Trabajo V1 — Matriz legal y árbol de decisión

> Estado: **EN PROGRESO**. Primera base jurídica verificada el 23-08-2026.
>
> Alcance: México, relaciones regidas por el Apartado A del artículo 123 constitucional y la Ley Federal del Trabajo (LFT).

## 1. Fuentes oficiales base

1. **Ley Federal del Trabajo — texto vigente, última reforma DOF 14-05-2026**  
   Cámara de Diputados: https://www.diputados.gob.mx/LeyesBiblio/pdf/LFT.pdf
2. **Decreto LFT en materia de reducción de jornada laboral — DOF 01-05-2026**  
   Diario Oficial: https://dof.gob.mx/nota_detalle_popup.php?codigo=5786537
3. **Ley del Seguro Social — texto vigente, última reforma DOF 15-01-2026**  
   Cámara de Diputados: https://www.diputados.gob.mx/LeyesBiblio/pdf/LSS.pdf
4. **Ley Federal de Protección de Datos Personales en Posesión de los Particulares — última reforma DOF 14-11-2025**  
   Cámara de Diputados: https://www.diputados.gob.mx/LeyesBiblio/pdf/LFPDPPP.pdf

## 2. Regla de versión 2026 sobre jornada

La LFT fue reformada el 01-05-2026 para establecer una jornada ordinaria máxima de 40 horas semanales en el artículo 59, **pero el decreto contiene una aplicación gradual**. Para 2026 el régimen transitorio conserva **48 horas semanales**; 2027: 46; 2028: 44; 2029: 42; 2030: 40.

Por tanto, el motor de reglas **no debe leer aisladamente el artículo 59**. Debe aplicar la tabla transitoria según la fecha de inicio/vigencia del contrato.

También existe gradualidad para trabajo extraordinario: en 2026 y 2027 el tope transitorio semanal permanece en 9 horas; después aumenta gradualmente hasta 12 en 2030.

**Clasificación:** `OBLIGATORIO POR LEY` + regla versionada por fecha.

## 3. Matriz inicial

| Campo / tema | Clasificación | Regla V1 | Fuente principal | Pregunta sencilla al usuario | Notas / alertas |
|---|---|---|---|---|---|
| Nombre de trabajador y patrón | OBLIGATORIO POR LEY | Debe constar en el escrito | LFT art. 25-I | ¿Cuál es el nombre completo del trabajador y del patrón? | Si patrón es persona moral, después validar razón social y representación |
| Nacionalidad | OBLIGATORIO POR LEY | Debe constar para ambas partes según art. 25-I | LFT art. 25-I | ¿Cuál es la nacionalidad? | No usar para discriminar |
| Edad | OBLIGATORIO POR LEY | Debe constar en el escrito | LFT art. 25-I | ¿Qué edad tiene el trabajador? | Activar reglas especiales si es menor de 18 |
| Sexo | OBLIGATORIO POR LEY | Art. 25-I lo incluye expresamente | LFT art. 25-I | ¿Qué sexo debe constar en el contrato? | Captura mínima; no usar para decisiones discriminatorias |
| Estado civil | OBLIGATORIO POR LEY | Art. 25-I lo incluye expresamente | LFT art. 25-I | ¿Cuál es el estado civil que debe constar? | Evitar usarlo para decisiones laborales |
| CURP | OBLIGATORIO POR LEY | Debe constar en el escrito | LFT art. 25-I | ¿Cuál es la CURP del trabajador? | Validar formato, no inferir datos sensibles adicionales |
| RFC | OBLIGATORIO POR LEY | Debe constar en el escrito | LFT art. 25-I | ¿Cuál es el RFC del trabajador y, en su caso, del patrón? | Revisión de experiencia de usuario para personas sin RFC disponible al iniciar borrador |
| Domicilio de trabajador y patrón | OBLIGATORIO POR LEY | Debe constar en el escrito | LFT art. 25-I | ¿Cuál es el domicilio de cada parte? | Distinguir domicilio de parte vs. lugar de trabajo |
| Tipo/duración de la relación | OBLIGATORIO POR LEY | Debe señalar obra, determinado, temporada, capacitación inicial o indeterminado; en su caso prueba | LFT arts. 25-II y 35 | ¿La necesidad de trabajo es permanente, temporal, por temporada o para una obra específica? | Si no hay estipulación expresa, la relación se presume indeterminada |
| Servicio / funciones | OBLIGATORIO POR LEY | Determinar con la mayor precisión posible | LFT art. 25-III | ¿Qué trabajo realizará la persona? | Evitar descripciones excesivamente abiertas |
| Lugar(es) de trabajo | OBLIGATORIO POR LEY | Debe constar | LFT art. 25-IV | ¿Dónde realizará normalmente el trabajo? | Si teletrabajo, activar capítulo especial |
| Duración de jornada | OBLIGATORIO POR LEY | Debe constar; aplicar régimen transitorio 2026 | LFT art. 25-V; arts. 58-68; transitorios DOF 01-05-2026 | ¿Qué días y horario ordinario tendrá? | No asumir 40 h en 2026; aplicar 48 h transitorias como máximo semanal general |
| Forma y monto del salario | OBLIGATORIO POR LEY | Debe constar | LFT art. 25-VI; arts. 82-86 | ¿Cuánto se pagará y cómo se calcula? | Validar salario mínimo aplicable en fase posterior |
| Día y lugar/forma de pago | OBLIGATORIO POR LEY | Debe constar | LFT art. 25-VII; art. 88 | ¿Cada cuándo y por qué medio se pagará? | Plazo máximo: semanal para trabajo material; 15 días para los demás |
| Capacitación/adiestramiento | OBLIGATORIO POR LEY EN EL ESCRITO | El contrato debe indicar que será capacitado/adiestrado conforme a planes/programas aplicables | LFT art. 25-VIII | ¿La empresa cuenta con plan o esquema de capacitación aplicable? | No confundir con relación de capacitación inicial de arts. 39-B y ss. |
| Días de descanso | OBLIGATORIO POR LEY | Deben reflejarse como otras condiciones de trabajo | LFT art. 25-IX; arts. 69-75 | ¿Qué día será el descanso semanal? | Por cada 6 días, al menos 1 con salario íntegro; prima dominical si corresponde |
| Vacaciones | OBLIGATORIO POR LEY | Incluir condición conforme a mínimos legales | LFT arts. 25-IX, 76-81 | ¿La relación inicia desde cero o existe antigüedad reconocida? | Mínimo 12 días al superar un año; escala por antigüedad |
| Prima vacacional | OBLIGATORIO POR LEY | Mínimo 25% sobre salarios del periodo vacacional | LFT art. 80 | No preguntar porcentaje si se usará mínimo legal; preguntar sólo si será superior | Regla calculable |
| Aguinaldo | OBLIGATORIO POR LEY | Mínimo 15 días de salario, proporcional si no completa año | LFT art. 87 | ¿La empresa otorgará sólo el mínimo legal o una prestación superior? | No debe omitirse por informalidad |
| Beneficiarios | OBLIGATORIO POR LEY EN EL ESCRITO | Designar beneficiarios para salarios/prestaciones devengadas no cobradas y supuestos del art. 501 | LFT art. 25-X | ¿A quién designa como beneficiario(s) para los efectos legales aplicables? | Diseñar captura clara y actualizable |
| IMSS / seguridad social | CONDICIONAL EN EL DOCUMENTO; OBLIGACIÓN LEGAL EXTERNA | La inscripción al IMSS es obligación patronal; no surge como requisito textual general del art. 25 | LSS art. 15-I; LFT arts. 39-A a 39-C para prueba/capacitación | ¿El trabajador ya fue dado de alta o está pendiente? | Nunca presentar “sin IMSS” como renuncia válida; si prueba/capacitación, la seguridad social es especialmente explícita |
| Aviso de privacidad | OBLIGATORIO COMO CUMPLIMIENTO DE DATOS; NO NECESARIAMENTE CLÁUSULA CENTRAL DEL CONTRATO | El responsable debe poner aviso de privacidad a disposición y permitir derechos ARCO | LFPDPPP arts. 15-21 | ¿El patrón ya cuenta con aviso de privacidad laboral? | Mejor tratarlo como documento/flujo anexo, no inflar el contrato base |

## 4. Árbol de decisión — borrador inicial

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
```

### Guardas obligatorias

- Nunca ofrecer `tiempo determinado` sólo porque el patrón “prefiere probar primero”.
- Periodo a prueba y capacitación inicial son figuras distintas.
- Periodo a prueba/capacitación inicial deben constar por escrito y garantizar seguridad social; de lo contrario operan las consecuencias del art. 39-C.
- No pueden aplicarse de manera simultánea o sucesiva al mismo trabajador en los supuestos prohibidos por el art. 39-D.
- Si termina el periodo a prueba/capacitación y continúa la relación, se considera indeterminada y el tiempo cuenta para antigüedad (art. 39-E).

## 5. Casos especiales identificados para segunda pasada

- Teletrabajo (LFT 330-A y siguientes): requiere contenido contractual adicional.
- Menores de edad: reglas especiales y restricciones.
- Trabajo del campo, plataformas digitales, personas trabajadoras del hogar y otros trabajos especiales: no deben entrar silenciosamente al contrato general V1.
- Trabajo fuera de México contratado en territorio nacional: art. 28 y requisitos adicionales.
- Jornada 2026-2030: debe ser regla temporal versionada, no texto fijo.
- Salario mínimo general/profesional y zona libre de la frontera norte: validar según fecha y ubicación antes de cerrar el contrato.
- Confidencialidad y propiedad intelectual: separar obligaciones legítimas de cláusulas que pretendan restringir derechos laborales o futuras actividades de manera excesiva.

## 6. Próxima investigación

1. Completar teletrabajo y trabajo híbrido.
2. Revisar salario mínimo y Zona Libre de la Frontera Norte para reglas geográficas/temporales.
3. Precisar horas extraordinarias con transición 2026-2030.
4. Revisar confidencialidad, secretos industriales y límites de no competencia.
5. Definir tratamiento de datos personales y aviso de privacidad laboral.
6. Separar campos imprescindibles para generar el contrato de campos que pueden quedar `PENDIENTE / NO PROPORCIONADO` sin falsear cumplimiento.
