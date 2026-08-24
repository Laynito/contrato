# Contrato Individual de Trabajo V1 — Base parametrizable

> **Documento de producto / plantilla jurídica en revisión.** No sustituye la validación de los datos del caso concreto ni debe emitirse si el motor marca `BLOQUEADO` o `REQUIERE_REVISION_ESPECIAL`.

## Reglas de uso

Antes de renderizar este contrato como `COMPLETO`, el futuro sistema debe haber aplicado `contrato-v1-cuestionario-y-bloqueos.md` y la matriz legal V1.

Los marcadores `{{...}}` son campos de producto. Los bloques `[[SI ...]]` son cláusulas condicionales y no deben aparecer en la versión final si la condición no se cumple.

---

# CONTRATO INDIVIDUAL DE TRABAJO

Contrato individual de trabajo que celebran, por una parte, **{{patron_nombre_o_razon_social}}**, de nacionalidad **{{patron_nacionalidad}}**, RFC **{{patron_rfc}}**, con domicilio en **{{patron_domicilio}}**, [[SI PATRON_PERSONA_MORAL]] representada en este acto por **{{representante_nombre}}**, en su carácter de **{{representante_caracter}}**, [[FIN]] a quien en lo sucesivo se denominará **“EL PATRÓN”**; y por la otra **{{trabajador_nombre}}**, de nacionalidad **{{trabajador_nacionalidad}}**, edad **{{trabajador_edad}}**, sexo **{{trabajador_sexo}}**, estado civil **{{trabajador_estado_civil}}**, CURP **{{trabajador_curp}}**, RFC **{{trabajador_rfc}}**, con domicilio en **{{trabajador_domicilio}}**, a quien en lo sucesivo se denominará **“LA PERSONA TRABAJADORA”**; al tenor de las siguientes declaraciones y cláusulas.

## DECLARACIONES

### I. Declara EL PATRÓN

1. Que cuenta con capacidad para celebrar la presente relación de trabajo.
2. Que requiere los servicios personales subordinados de LA PERSONA TRABAJADORA para desempeñar el puesto de **{{puesto}}**, con las funciones descritas en este contrato.
3. Que señala como domicilio para efectos de esta relación laboral el ubicado en **{{patron_domicilio}}**.

### II. Declara LA PERSONA TRABAJADORA

1. Que los datos personales y de identificación asentados en este contrato son los proporcionados para integrar la relación laboral.
2. Que cuenta con la capacidad y, en su caso, conocimientos necesarios para prestar los servicios descritos, sin perjuicio de la capacitación y adiestramiento que legalmente correspondan.

### III. Declaran ambas partes

Que reconocen que la relación se regirá por la Constitución Política de los Estados Unidos Mexicanos, la Ley Federal del Trabajo y demás disposiciones aplicables, y que ninguna cláusula podrá interpretarse como renuncia a derechos mínimos de LA PERSONA TRABAJADORA.

## CLÁUSULAS

### PRIMERA. Naturaleza y duración de la relación

La relación de trabajo será **{{tipo_relacion}}**, iniciando el **{{fecha_inicio}}**.

[[SI TIEMPO_DETERMINADO]]
La duración determinada se justifica exclusivamente por la siguiente causa: **{{causa_tiempo_determinado}}**. La relación concluirá cuando se actualice **{{evento_o_fecha_fin}}**, sin que esta estipulación pueda utilizarse para encubrir una necesidad permanente.
[[FIN]]

[[SI OBRA_DETERMINADA]]
La relación se limita a la ejecución de la siguiente obra determinada: **{{descripcion_obra}}**. Su vigencia dependerá de la conclusión real de dicha obra conforme a la legislación aplicable.
[[FIN]]

[[SI TEMPORADA]]
La prestación de servicios será de carácter discontinuo o de temporada en los periodos siguientes: **{{periodos_temporada}}**, conservándose los derechos que correspondan conforme a la Ley Federal del Trabajo.
[[FIN]]

[[SI PERIODO_A_PRUEBA]]
Las partes acuerdan un periodo a prueba de **{{duracion_prueba}}**, exclusivamente para verificar que LA PERSONA TRABAJADORA cumple los requisitos y conocimientos necesarios para el puesto, conforme a los artículos 39-A y correlativos de la Ley Federal del Trabajo. Durante dicho periodo gozará del salario, seguridad social y prestaciones correspondientes al puesto. Esta figura no podrá prorrogarse ni aplicarse de manera sucesiva en contravención a la ley.
[[FIN]]

[[SI CAPACITACION_INICIAL]]
La relación inicia bajo la modalidad de capacitación inicial por **{{duracion_capacitacion_inicial}}**, con el objeto de que LA PERSONA TRABAJADORA adquiera los conocimientos o habilidades necesarios para la actividad contratada, conforme a los artículos 39-B y correlativos de la Ley Federal del Trabajo. Durante este periodo gozará de salario, seguridad social y prestaciones correspondientes.
[[FIN]]

### SEGUNDA. Puesto y servicios

LA PERSONA TRABAJADORA prestará servicios en el puesto de **{{puesto}}** y realizará principalmente las siguientes funciones:

**{{funciones_detalladas}}**

Las instrucciones relacionadas con el trabajo deberán guardar relación razonable con el puesto y con la naturaleza de los servicios contratados. Esta cláusula no autoriza a sustituir la descripción concreta de funciones por obligaciones ilimitadas o ajenas a la relación laboral.

### TERCERA. Lugar de trabajo

El lugar principal de prestación de los servicios será **{{lugar_principal_trabajo}}**, ubicado en el municipio de **{{municipio_trabajo}}**, **{{entidad_trabajo}}**.

[[SI OTROS_LUGARES_HABITUALES]]
También podrán prestarse servicios habitualmente en: **{{otros_lugares_trabajo}}**, siempre dentro de los términos legalmente aplicables y sin alterar unilateralmente condiciones esenciales en perjuicio de LA PERSONA TRABAJADORA.
[[FIN]]

### CUARTA. Jornada

La jornada ordinaria se distribuirá de la siguiente forma:

**{{horario_y_dias}}**

El tiempo de descanso dentro de la jornada será de **{{descanso_intrajornada}}**.

La jornada deberá mantenerse dentro de los máximos legales aplicables a su clasificación y a la fecha de vigencia del contrato. El sistema que genere el documento deberá validar el máximo semanal transitorio correspondiente y no podrá utilizar tiempo extraordinario para subsanar una jornada ordinaria ilegal.

### QUINTA. Tiempo extraordinario

El trabajo extraordinario, cuando excepcionalmente resulte necesario y sea jurídicamente procedente, se sujetará a los límites, controles y formas de pago previstos en la Ley Federal del Trabajo. No se pacta como componente ordinario o permanente de la jornada.

Para contratos vigentes en 2026, el motor de reglas deberá aplicar el límite transitorio vigente de horas extraordinarias y actualizarlo automáticamente según la fecha aplicable.

### SEXTA. Salario

EL PATRÓN pagará a LA PERSONA TRABAJADORA un salario de **{{salario_monto}} {{salario_moneda}}** por **{{salario_unidad}}**.

El salario pactado no podrá ser inferior al salario mínimo general o profesional aplicable conforme a la fecha, municipio y ocupación efectiva. Antes de emitir el contrato como `COMPLETO`, el sistema deberá validar dicha regla.

[[SI SALARIO_VARIABLE]]
Adicionalmente, se aplicará el siguiente componente variable: **{{salario_variable_regla}}**. Su operación no podrá reducir el salario por debajo de los mínimos legales aplicables.
[[FIN]]

### SÉPTIMA. Pago

El salario se cubrirá con periodicidad **{{periodicidad_pago}}**, los días **{{dia_pago}}**, mediante **{{medio_pago}}**, respetando los límites legales sobre periodicidad de pago.

### OCTAVA. Descanso semanal y días de descanso obligatorio

El día ordinario de descanso semanal será **{{dia_descanso_semanal}}**, sin perjuicio de los días de descanso obligatorio y demás derechos previstos en la Ley Federal del Trabajo.

[[SI PRIMA_DOMINICAL]]
Cuando proceda conforme a la ley por prestar servicios en domingo, se cubrirá la prima dominical correspondiente.
[[FIN]]

### NOVENA. Vacaciones y prima vacacional

LA PERSONA TRABAJADORA disfrutará de vacaciones conforme a su antigüedad y a los mínimos previstos por la Ley Federal del Trabajo. Se reconoce para efectos de antigüedad la fecha **{{fecha_antiguedad}}**.

La prima vacacional será de **{{prima_vacacional_porcentaje}}%**, que en ningún caso podrá ser inferior al mínimo legal vigente.

### DÉCIMA. Aguinaldo

LA PERSONA TRABAJADORA tendrá derecho a un aguinaldo anual equivalente a **{{aguinaldo_dias}} días de salario**, sin que pueda ser inferior al mínimo legal; si no ha cumplido un año de servicios tendrá derecho a la parte proporcional correspondiente.

### DÉCIMA PRIMERA. Capacitación y adiestramiento

LA PERSONA TRABAJADORA será capacitada y adiestrada conforme a los planes y programas que resulten aplicables, en términos de la Ley Federal del Trabajo.

Esta cláusula es independiente, en su caso, de la modalidad jurídica de capacitación inicial prevista en la cláusula primera.

### DÉCIMA SEGUNDA. Seguridad social

EL PATRÓN cumplirá las obligaciones de seguridad social que legalmente le correspondan. Ninguna omisión de datos, estado pendiente o referencia en este contrato podrá interpretarse como renuncia de LA PERSONA TRABAJADORA a derechos de seguridad social ni como traslado de obligaciones patronales.

**Estado operativo informado al generar el contrato:** {{estado_imss}}

El valor anterior es únicamente informativo y no constituye por sí mismo prueba de cumplimiento ante la autoridad competente.

### DÉCIMA TERCERA. Beneficiarios

Para los efectos previstos en el artículo 25, fracción X, y demás disposiciones aplicables de la Ley Federal del Trabajo, LA PERSONA TRABAJADORA designa como beneficiario(s):

**{{beneficiarios}}**

### DÉCIMA CUARTA. Protección de datos personales

Los datos personales derivados de la relación laboral deberán tratarse conforme a la legislación aplicable en materia de protección de datos personales. El aviso de privacidad laboral correspondiente constituye un instrumento separado de este contrato.

**Estado operativo del aviso de privacidad:** {{estado_aviso_privacidad}}

La mención anterior no sustituye la obligación del responsable de poner el aviso de privacidad a disposición de la persona titular ni el ejercicio de los derechos que legalmente correspondan.

[[SI CONFIDENCIALIDAD]]
### DÉCIMA QUINTA. Confidencialidad

LA PERSONA TRABAJADORA se obliga a mantener la reserva respecto de la información confidencial y, en su caso, secretos industriales a los que tenga acceso con motivo de sus funciones, siempre que dicha información sea identificable como protegida y su tratamiento se ajuste a la legislación aplicable.

Esta obligación no limita el ejercicio de derechos laborales, la formulación de denuncias ante autoridades competentes ni puede interpretarse como una prohibición general de trabajar para terceros al terminar la relación.
[[FIN]]

[[SI TELETRABAJO]]
### DÉCIMA SEXTA. Teletrabajo

Las partes reconocen que más del cuarenta por ciento del tiempo de trabajo se prestará en el domicilio de LA PERSONA TRABAJADORA o en el lugar elegido por ésta, por lo que resulta aplicable el régimen legal de teletrabajo.

El porcentaje estimado de trabajo remoto será **{{porcentaje_teletrabajo}}%**.

EL PATRÓN proporcionará los siguientes equipos e insumos: **{{equipo_teletrabajo}}**.

EL PATRÓN cubrirá los servicios asociados al teletrabajo conforme a la siguiente cantidad o fórmula: **{{formula_costos_teletrabajo}}**, incluyendo telecomunicaciones y la parte proporcional de electricidad que legalmente corresponda.

Los mecanismos de contacto y supervisión serán: **{{mecanismos_supervision}}**.

Las partes respetarán el derecho a la desconexión al término de la jornada y las obligaciones de seguridad y salud aplicables, incluida la NOM-037-STPS-2023 cuando corresponda.
[[FIN]]

[[SI PROPIEDAD_INTELECTUAL_SIMPLE]]
### DÉCIMA SÉPTIMA. Obras creadas en la relación laboral

Cuando, por la naturaleza de las funciones pactadas y dentro de la relación laboral, LA PERSONA TRABAJADORA cree obras protegibles por derecho de autor, se aplicará el régimen previsto por la Ley Federal del Derecho de Autor, incluido su artículo 84, según corresponda al caso concreto.

Esta cláusula no pretende extender automáticamente la titularidad del patrón a creaciones ajenas al objeto de la relación ni sustituye acuerdos específicos cuando la materia requiera revisión especializada.
[[FIN]]

### DÉCIMA OCTAVA. Condiciones más favorables y nulidad de renuncias

Las condiciones contenidas en este contrato se entienden sin perjuicio de derechos más favorables reconocidos por la ley, contratos colectivos, reglamentos aplicables o acuerdos válidos. Será nula cualquier estipulación que implique renuncia a derechos mínimos irrenunciables.

### DÉCIMA NOVENA. Integridad del documento

Las partes manifiestan que los datos asentados corresponden a la información proporcionada para la celebración de la relación laboral. Cualquier campo que el sistema identifique como pendiente deberá completarse antes de que el documento pueda presentarse como contrato final `COMPLETO`.

Leído que fue el presente contrato y enteradas las partes de su contenido y alcance, lo firman por duplicado en **{{lugar_firma}}**, a **{{fecha_firma}}**.


**EL PATRÓN**  
{{patron_nombre_o_razon_social}}  
[[SI PATRON_PERSONA_MORAL]]Por: {{representante_nombre}}[[FIN]]

Firma: ______________________________


**LA PERSONA TRABAJADORA**  
{{trabajador_nombre}}

Firma: ______________________________

---

## Anexo técnico de renderizado

El futuro generador debe eliminar completamente encabezados y bloques condicionales no aplicables; no mostrar tokens `[[SI...]]`, `[[FIN]]` ni campos vacíos.

Si un campo obligatorio está vacío, el sistema sólo puede producir una vista `BORRADOR_INCOMPLETO` con marca visible de pendiente; no una versión final que simule integridad.

Casos con `REQUIERE_REVISION_ESPECIAL` pueden previsualizarse para revisión, pero no deben ofrecerse como contrato final validado automáticamente.
