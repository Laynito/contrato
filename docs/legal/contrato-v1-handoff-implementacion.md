# Contrato V1 — Handoff de implementación

> Documento de transición desde la fase jurídica/producto. **No contiene código ni decide stack técnico.** Su objetivo es impedir que la implementación reinterprete o debilite las reglas ya aprobadas en la documentación V1.

## 1. Artefactos canónicos de entrada

La implementación futura debe tratar como fuente de verdad, en este orden:

1. `contrato-individual-v1.md` — matriz legal y árbol de decisión.
2. `contrato-v1-cuestionario-y-bloqueos.md` — preguntas, estados y bloqueos de emisión.
3. `salarios-minimos-profesionales-2026.md` — catálogo/regla salarial versionada.
4. `contrato-v1-casos-especiales.md` — rutas que no deben resolverse automáticamente.
5. `contrato-base-v1.md` — plantilla parametrizable y bloques condicionales.
6. `contrato-v1-casos-prueba.md` — comportamiento esperado positivo/negativo.
7. `contrato-v1-readiness.md` — gate jurídico/producto y gate futuro de producción.

Ningún prompt libre de IA puede sustituir estos artefactos.

## 2. Orden determinista de evaluación

El flujo futuro debe preservar el siguiente orden lógico:

```text
CAPTURA
  ↓
NORMALIZACIÓN DE DATOS
  ↓
VALIDACIÓN DE CAMPOS OBLIGATORIOS
  ↓
DETECCIÓN DE CONTRADICCIONES
  ↓
DETECCIÓN DE CASOS ESPECIALES
  ↓
DETERMINACIÓN DEL TIPO DE RELACIÓN
  ↓
VALIDACIÓN DE JORNADA Y HORAS EXTRA
  ↓
VALIDACIÓN DE SALARIO MÍNIMO GENERAL/PROFESIONAL
  ↓
VALIDACIÓN DE PRESTACIONES MÍNIMAS
  ↓
REGLAS CONDICIONALES: TELETRABAJO / PRUEBA / CAPACITACIÓN / ETC.
  ↓
CÁLCULO DEL ESTADO
  ↓
SELECCIÓN DE CLÁUSULAS
  ↓
RENDER DEL DOCUMENTO
  ↓
VALIDACIÓN POST-RENDER
  ↓
SNAPSHOT DE REGLAS + RESPUESTAS + PLANTILLA + DOCUMENTO
```

El orden importa: por ejemplo, un salario no debe validarse antes de resolver fecha, municipio y ocupación efectiva.

## 3. Estados obligatorios

La implementación debe soportar exactamente estos estados semánticos:

### `BORRADOR_INCOMPLETO`

Hay datos pendientes que impiden emitir un contrato definitivo, pero el usuario puede continuar trabajando el borrador.

### `LISTO_PARA_REVISION`

Los datos mínimos están presentes, pero existe una condición que requiere revisión humana antes de emitir como definitivo.

### `COMPLETO`

Todas las validaciones obligatorias y condicionales aplicables están satisfechas. Sólo este estado puede habilitar la generación definitiva/consumo de crédito.

### `BLOQUEADO`

Existe una contradicción, ilegalidad objetiva o defecto que no debe ocultarse ni convertirse en texto contractual aparentemente válido.

No crear estados alternativos que permitan saltarse estas garantías sin una decisión jurídica versionada posterior.

## 4. Reglas que nunca pueden degradarse a warning informativo

Deben impedir `COMPLETO` cuando correspondan:

- dato obligatorio del artículo 25 LFT ausente;
- tiempo determinado sin causa jurídicamente admisible documentada;
- obra determinada sin obra identificable;
- periodo a prueba/capacitación inicial fuera de sus condiciones legales;
- jornada ordinaria superior al máximo aplicable por fecha/clasificación;
- salario inferior al mínimo general o profesional aplicable;
- vacaciones, prima vacacional o aguinaldo inferiores al mínimo legal;
- teletrabajo especial activado sin los elementos contractuales exigibles;
- contradicciones materiales entre respuestas;
- caso especial expresamente marcado para revisión.

## 5. IA: capacidades permitidas y prohibidas

### Puede asistir

- explicar preguntas en lenguaje sencillo;
- detectar posible contradicción para que una regla determinista la confirme;
- sugerir una redacción descriptiva de funciones a partir de información proporcionada;
- resumir al usuario por qué una respuesta quedó bloqueada o en revisión.

### No puede decidir por sí sola

- qué ley aplica;
- si existe causa válida de tiempo determinado;
- el salario mínimo aplicable;
- el máximo de jornada;
- si una prestación inferior es aceptable;
- si se puede ignorar IMSS u otra obligación legal;
- si un caso especial puede convertirse en contrato estándar;
- qué cláusulas legales se insertan en el documento definitivo.

Toda decisión anterior debe provenir de reglas/versiones aprobadas.

## 6. Versionado mínimo por contrato generado

Cada contrato definitivo debe conservar de forma histórica e inmutable, como mínimo:

- identificador/version de reglas jurídicas;
- fecha efectiva usada para resolver reglas temporales;
- versión del catálogo salarial;
- versión de la plantilla contractual;
- respuestas normalizadas que originaron el documento;
- resultado de validaciones y estado final;
- bloques/cláusulas condicionales activados;
- documento final generado;
- fecha/hora de generación.

Una actualización futura de reglas no debe modificar silenciosamente contratos históricos.

## 7. Validación post-render obligatoria

Antes de entregar un documento definitivo se debe confirmar:

- cero marcadores `{{...}}` sin resolver;
- cero bloques `[[SI ...]]` / `[[FIN]]` visibles;
- ausencia de campos obligatorios vacíos;
- numeración coherente de cláusulas después de remover bloques no aplicables;
- ausencia de afirmaciones de cumplimiento que sólo eran estados `PENDIENTE`;
- coincidencia entre salario/jornada/prestaciones renderizadas y resultados del motor;
- referencia correcta a la modalidad de relación seleccionada;
- documento legible y reproducible desde el snapshot histórico.

Si falla esta validación, el documento no puede considerarse `COMPLETO` aunque el motor previo haya pasado.

## 8. Conversión de los 25 casos jurídicos a aceptación técnica

Cada caso documentado en `contrato-v1-casos-prueba.md` deberá convertirse en una prueba automatizada futura con, como mínimo:

- respuestas de entrada;
- fecha de reglas;
- estado esperado;
- códigos/reglas que deben activarse;
- cláusulas esperadas o prohibidas;
- expectativa sobre generación definitiva.

Los casos negativos deben demostrar que el sistema **rechaza** o deriva a revisión, no sólo que muestra un mensaje.

## 9. Seguridad y privacidad — gate antes de producción

Antes de almacenar datos laborales reales deben quedar definidos y validados:

- autenticación y autorización;
- aislamiento entre cuentas/organizaciones;
- cifrado en tránsito y controles razonables para datos almacenados;
- política de minimización y retención;
- manejo separado del aviso de privacidad;
- exportación/corrección/supresión conforme al flujo de derechos aplicable;
- respaldos y restauración;
- logs sin CURP, RFC, domicilios u otros datos personales innecesarios;
- acceso administrativo auditable.

No usar datos reales para pruebas de desarrollo si pueden sustituirse por datos sintéticos.

## 10. Gate mínimo para declarar “listo para producción”

No declarar producción hasta que estén en verde:

- [ ] motor de reglas determinista implementado;
- [ ] catálogo salarial versionado implementado;
- [ ] renderizador contractual implementado;
- [ ] los 25 casos jurídicos convertidos a pruebas automatizadas y en verde;
- [ ] pruebas adicionales de borde y contradicción;
- [ ] validación post-render en verde;
- [ ] snapshots/versionado histórico funcionando;
- [ ] seguridad/autorización/aislamiento revisados;
- [ ] privacidad y manejo de datos personales revisados;
- [ ] respaldo/restauración probados;
- [ ] observabilidad sin exposición de datos sensibles;
- [ ] revisión humana final del documento producido;
- [ ] validación operativa mediante el GPT VPS Runner;
- [ ] autorización explícita del propietario para desplegar/mergear lo correspondiente.

## 11. Bloqueos actuales para iniciar implementación

A la fecha de este documento existen dos bloqueos externos al cierre jurídico:

1. `README.md` e Issue #1 aún indican **no programar todavía la aplicación**. Este handoff no modifica esa decisión; sólo deja la siguiente fase preparada.
2. Los jobs `status` de `contrato` enviados al GPT VPS Runner no han recibido todavía `GPT_RUNNER_RESULT`, por lo que no puede darse por verificado el entorno VPS del proyecto.

Mientras esos bloqueos existan, sí pueden completarse revisión documental, aceptación, planificación y preparación de especificaciones; no debe fingirse que la aplicación está desplegada o validada.
