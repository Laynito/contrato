# Contrato V1 — Cuestionario, estados y bloqueos de emisión

> Estado: especificación jurídica/producto para el futuro motor de reglas. No es código de aplicación.

## 1. Objetivo

Definir qué debe preguntar el producto, qué puede guardarse incompleto y qué condiciones impiden emitir un contrato como `COMPLETO`.

El sistema debe distinguir siempre entre:

- `BORRADOR_INCOMPLETO`: puede guardarse aunque falten datos.
- `LISTO_PARA_REVISION`: contiene datos suficientes para revisión humana, pero existe una regla especial o incertidumbre.
- `COMPLETO`: contiene los elementos obligatorios del escrito y pasó las validaciones automáticas aplicables.
- `BLOQUEADO`: existe una incompatibilidad jurídica o falta un dato esencial que impide emitirlo como contrato final completo.

Nunca debe convertir un dato faltante en una afirmación falsa, ni usar frases como “no aplica” cuando la obligación sí existe.

## 2. Datos de las partes

| Campo | Pregunta | Borrador | Completo | Regla |
|---|---|---:|---:|---|
| Nombre trabajador | ¿Cuál es el nombre completo del trabajador? | Sí | Obligatorio | LFT 25-I |
| Nacionalidad trabajador | ¿Cuál es su nacionalidad? | Sí | Obligatorio | LFT 25-I |
| Edad | ¿Qué edad tiene? | Sí | Obligatorio | LFT 25-I; si <18 activar revisión especial |
| Sexo | ¿Qué sexo debe constar en el contrato? | Sí | Obligatorio | LFT 25-I |
| Estado civil | ¿Cuál es el estado civil que debe constar? | Sí | Obligatorio | LFT 25-I |
| CURP | ¿Cuál es la CURP? | Sí | Obligatorio | LFT 25-I |
| RFC trabajador | ¿Cuál es el RFC? | Sí | Obligatorio para `COMPLETO` | LFT 25-I |
| Domicilio trabajador | ¿Cuál es su domicilio? | Sí | Obligatorio | LFT 25-I |
| Nombre/razón social patrón | ¿Quién será el patrón? | Sí | Obligatorio | LFT 25-I |
| Nacionalidad patrón | ¿Cuál es la nacionalidad del patrón? | Sí | Obligatorio | LFT 25-I |
| RFC patrón | ¿Cuál es el RFC del patrón? | Sí | Obligatorio para `COMPLETO` | LFT 25-I |
| Domicilio patrón | ¿Cuál es el domicilio del patrón? | Sí | Obligatorio | LFT 25-I |
| Representante | Si el patrón es persona moral, ¿quién firma en su representación? | Sí | Condicional | Debe acreditarse representación en el flujo/documentación correspondiente |

### Regla de ausencia

Si falta cualquiera de los datos expresamente exigidos por LFT art. 25-I, el sistema puede guardar el documento, pero no debe etiquetarlo como `COMPLETO`.

## 3. Naturaleza de la relación

Pregunta inicial obligatoria:

> ¿La necesidad de trabajo es permanente, temporal, por temporada o corresponde a una obra específica?

Decisión:

1. Permanente/ordinaria → `TIEMPO_INDETERMINADO`.
2. Obra con objeto identificable → evaluar `OBRA_DETERMINADA` y exigir descripción de la obra/causa.
3. Necesidad temporal o sustitución → evaluar `TIEMPO_DETERMINADO` y exigir causa jurídica concreta.
4. Actividad fija y periódica/discontinua → evaluar `TEMPORADA`.
5. “Quiero probarlo primero” no habilita tiempo determinado; ofrecer análisis de `PERIODO_A_PRUEBA` si se cumplen requisitos.

### Bloqueos

- `TIEMPO_DETERMINADO` sin causa documentada → `BLOQUEADO` para emisión completa.
- `OBRA_DETERMINADA` sin obra identificable → `BLOQUEADO`.
- `PERIODO_A_PRUEBA` o `CAPACITACION_INICIAL` no documentados por escrito → no deben generarse como tales.
- Prueba y capacitación inicial no deben combinarse de forma prohibida ni repetirse sucesivamente en los supuestos del art. 39-D.

## 4. Puesto, funciones y lugar

Campos:

- nombre del puesto;
- descripción concreta de servicios/funciones;
- centro principal de trabajo;
- otros lugares habituales, si existen;
- municipio y entidad donde se presta principalmente el servicio.

Preguntas:

- ¿Qué trabajo realizará la persona?
- ¿Dónde realizará normalmente el trabajo?
- ¿Habrá más de un lugar habitual de trabajo?

### Bloqueos

- funciones vacías o descritas sólo como “lo que se le indique” → `BLOQUEADO` para `COMPLETO` hasta precisar el servicio;
- lugar de trabajo ausente → `BLOQUEADO`;
- municipio ausente → impide validar salario mínimo geográfico, por lo que bloquea la validación salarial final.

## 5. Jornada y descansos

Preguntas:

- ¿Qué días trabajará?
- ¿A qué hora inicia y termina cada día?
- ¿Qué tiempo de descanso tendrá durante la jornada?
- ¿Qué día será el descanso semanal?

Reglas automáticas:

- calcular horas diarias y semanales;
- aplicar la transición legal según fecha de vigencia: 2026=48 h, 2027=46 h, 2028=44 h, 2029=42 h, 2030=40 h como máximo semanal general del régimen transitorio;
- distinguir jornada diurna, nocturna o mixta cuando sea necesario para sus límites diarios;
- no utilizar horas extraordinarias para “arreglar” una jornada ordinaria que excede el máximo.

### Horas extraordinarias

Pregunta opcional/condicional:

> ¿El puesto puede requerir ocasionalmente tiempo extraordinario?

La respuesta no crea una obligación habitual. En 2026 el motor debe respetar el límite transitorio de 9 horas extraordinarias semanales y las reglas de pago aplicables.

### Bloqueos

- jornada ordinaria calculada superior al máximo aplicable → `BLOQUEADO`;
- descanso semanal incompatible con mínimos legales → `BLOQUEADO`;
- cláusula que convierta horas extra en obligación permanente ordinaria → `REQUIERE_REVISION`.

## 6. Salario y pago

Preguntas:

- ¿Cuál será el salario y su unidad de cálculo?
- ¿Cada cuándo se pagará?
- ¿Por qué medio se pagará?
- ¿Se otorgará alguna prestación superior al mínimo legal?

Reglas automáticas:

1. resolver zona salarial por municipio;
2. resolver si las funciones corresponden a una ocupación con salario mínimo profesional;
3. tomar el mayor mínimo aplicable;
4. comparar el salario pactado contra ese piso;
5. validar periodicidad de pago conforme a art. 88.

Para Tijuana en 2026, el piso general de ZLFN es $440.87 diarios, salvo salario profesional superior aplicable.

### Bloqueos

- salario menor al mínimo legal/profesional aplicable → `BLOQUEADO`;
- ocupación ambigua que podría caer en salario profesional → `LISTO_PARA_REVISION`, no `COMPLETO`, hasta resolver clasificación;
- periodicidad de pago incompatible con art. 88 → `BLOQUEADO`.

## 7. Prestaciones mínimas

El producto no debe preguntar si el usuario “quiere incluir” prestaciones mínimas. Deben incorporarse por regla legal, permitiendo sólo capturar mejoras.

Campos/reglas:

- vacaciones según antigüedad;
- prima vacacional mínima 25%;
- aguinaldo mínimo 15 días;
- descanso semanal;
- prima dominical cuando corresponda;
- capacitación/adiestramiento conforme a planes/programas aplicables.

Preguntas útiles:

- ¿Existe antigüedad previa que deba reconocerse?
- ¿Se otorgarán vacaciones, prima vacacional o aguinaldo superiores al mínimo legal?

### Bloqueo

Cualquier valor inferior al mínimo aplicable debe impedir `COMPLETO`.

## 8. Beneficiarios

Pregunta:

> ¿A quién designa el trabajador como beneficiario(s) para salarios y prestaciones devengadas no cobradas y los supuestos legales aplicables?

Debe permitir uno o varios beneficiarios y los datos necesarios para individualizarlos.

Ausencia de beneficiarios → puede existir `BORRADOR_INCOMPLETO`, pero no `COMPLETO` por el art. 25-X.

## 9. IMSS / seguridad social

El sistema debe preguntar sólo por estado operativo:

> ¿El trabajador ya fue dado de alta ante el IMSS o está pendiente el trámite?

Valores sugeridos:

- `ALTA_CONFIRMADA`
- `TRAMITE_PENDIENTE`
- `NO_INFORMADO`

Nunca ofrecer:

- “renuncia al IMSS”;
- “trabajo informal sin IMSS” como modalidad jurídica válida;
- cláusula que traslade al trabajador la obligación patronal.

La falta de dato no debe inventar cumplimiento. Si se usa periodo a prueba o capacitación inicial, la seguridad social debe tratarse con especial alerta por arts. 39-A a 39-C.

## 10. Teletrabajo e híbrido

Pregunta de activación:

> ¿Qué porcentaje aproximado del tiempo trabajará fuera del centro de trabajo desde su domicilio o un lugar elegido por él/ella?

- `<=40%` → no activar automáticamente el Capítulo XII Bis sólo por llamarlo “híbrido”.
- `>40%` → activar flujo especial de teletrabajo.

Si se activa, exigir:

- equipo e insumos entregados;
- mecanismo de contacto y supervisión;
- monto/fórmula para telecomunicaciones y parte proporcional de electricidad;
- reglas de desconexión;
- cumplimiento documental y de seguridad/salud aplicable, incluida NOM-037-STPS-2023.

Falta de esos elementos → `BLOQUEADO` para contrato de teletrabajo `COMPLETO`.

## 11. Confidencialidad, secretos e información

Pregunta:

> ¿El puesto tendrá acceso a información confidencial o secretos industriales identificables?

Si sí, permitir cláusula de confidencialidad proporcional y ligada a información legítimamente protegible.

No convertir automáticamente esta opción en prohibición de trabajar para terceros después de terminar la relación.

`NO_COMPETENCIA_POST_EMPLEO` → siempre `REQUIERE_REVISION_ESPECIAL` en V1.

## 12. Privacidad y ARCO

El contrato no sustituye el aviso de privacidad laboral.

Pregunta operativa:

> ¿El patrón ya cuenta con aviso de privacidad para datos de trabajadores?

Estados:

- `AVISO_DISPONIBLE`
- `AVISO_PENDIENTE`
- `NO_INFORMADO`

El producto debe mantener separado el documento/flujo de privacidad y no rellenar el contrato con una falsa declaración de cumplimiento.

## 13. Casos que obligan a revisión especial

Derivar a `LISTO_PARA_REVISION` / `REQUIERE_REVISION_ESPECIAL` cuando se detecte al menos uno:

- trabajador menor de 18 años;
- trabajo del campo;
- persona trabajadora del hogar;
- plataformas digitales;
- trabajo fuera de México contratado en territorio nacional;
- deportistas, artistas, agentes de comercio u otro trabajo especial con régimen propio relevante;
- ocupación dudosa frente a salario mínimo profesional;
- no competencia post-empleo;
- propiedad intelectual compleja más allá de la regla general de obra creada en relación laboral;
- esquema de comisiones, propinas, salario variable o prestaciones atípicas que impidan validar el piso salarial con seguridad;
- jornada o descanso no clasificable automáticamente;
- cualquier contradicción entre respuestas del usuario.

## 14. Regla de emisión

### Puede guardarse como `BORRADOR_INCOMPLETO`

Prácticamente cualquier avance, siempre que el sistema muestre qué falta y no represente el documento como jurídicamente completo.

### Puede marcarse `LISTO_PARA_REVISION`

Cuando estén llenos los campos esenciales, pero exista una bandera de revisión especial.

### Sólo puede marcarse `COMPLETO` si

1. están presentes los datos requeridos por LFT art. 25;
2. la figura contractual pasó el árbol de decisión;
3. jornada y descansos son compatibles con la ley vigente para la fecha;
4. salario supera o iguala el mínimo geográfico/profesional aplicable;
5. prestaciones no son inferiores a mínimos legales;
6. teletrabajo, si aplica, contiene sus elementos adicionales;
7. no existe contradicción o bandera que exija revisión especial;
8. el texto final no declara como cumplida una obligación externa que el usuario dejó `PENDIENTE/NO_INFORMADO`.

## 15. Mensajes de producto recomendados

Cuando falte un dato legal:

> “Puedes continuar y guardar un borrador, pero este dato es necesario antes de emitir el contrato como completo.”

Cuando exista obligación externa pendiente:

> “El contrato puede documentar que este trámite está pendiente, pero la obligación legal no desaparece por omitirla del texto.”

Cuando se detecte un caso especial:

> “Este caso requiere revisión especial antes de emitir el contrato final. Guardaremos tus datos y señalaremos exactamente qué debe revisarse.”

## 16. Criterio de readiness de Contrato V1

La documentación jurídica/producto puede considerarse cerrada para pasar a diseño técnico cuando existan, como mínimo:

- matriz legal trazable;
- árbol de decisión;
- catálogo salarial 2026 y regla de selección;
- esta especificación de cuestionario/bloqueos;
- contrato base V1 derivado de las reglas;
- lista de casos de prueba jurídicos positivos y negativos;
- registro explícito de asuntos que permanecen en `REQUIERE_REVISION_ESPECIAL`.

No debe declararse “listo para producción” sólo porque el documento base exista; la futura aplicación necesitará implementación, pruebas y validación de los casos de borde antes de una salida real a usuarios.
