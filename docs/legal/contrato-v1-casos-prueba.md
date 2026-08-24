# Contrato V1 — Casos de prueba jurídicos

> Objetivo: convertir las reglas jurídicas/producto en escenarios verificables antes de implementar el motor.

## Convenciones

Resultados esperados:

- `COMPLETO`: puede emitirse como contrato final.
- `BORRADOR_INCOMPLETO`: faltan datos legales, pero puede guardarse.
- `LISTO_PARA_REVISION`: datos suficientes, existe bandera de revisión especial.
- `BLOQUEADO`: existe incompatibilidad legal o una validación crítica falló.

## Caso 1 — Indeterminado ordinario válido en Tijuana

Datos:
- mayor de 18 años;
- necesidad permanente;
- funciones definidas;
- trabajo presencial en Tijuana;
- jornada dentro del máximo 2026;
- salario diario superior a $440.87 y sin ocupación profesional superior;
- prestaciones mínimas o superiores;
- datos del art. 25 completos.

Esperado: `COMPLETO`.

## Caso 2 — Tiempo determinado por preferencia patronal

Datos:
- necesidad permanente;
- patrón elige “3 meses porque primero quiero probarlo”;
- no existe causa temporal real.

Esperado: `BLOQUEADO` para tiempo determinado. El flujo debe orientar a indeterminado y, si jurídicamente procede, evaluar periodo a prueba.

## Caso 3 — Sustitución temporal documentada

Datos:
- persona contratada para cubrir una incapacidad/ausencia temporal identificable;
- causa y evento de terminación documentados;
- resto de datos completos.

Esperado: puede continuar como `TIEMPO_DETERMINADO`, sujeto a validaciones restantes.

## Caso 4 — Obra determinada sin obra definida

Datos:
- usuario selecciona obra determinada;
- descripción: “trabajos varios según se necesiten”.

Esperado: `BLOQUEADO`; exigir objeto de obra identificable.

## Caso 5 — Jornada superior al máximo aplicable

Datos:
- contrato 2026;
- horario ordinario suma 52 horas semanales;
- usuario intenta declarar 4 horas como “extra fija”.

Esperado: `BLOQUEADO`. No permitir corregir una jornada ordinaria ilegal mediante horas extra habituales.

## Caso 6 — Tiempo extraordinario ocasional 2026

Datos:
- jornada ordinaria válida;
- se prevé trabajo extraordinario excepcional;
- el esquema no excede el límite transitorio de 9 horas semanales y se sujeta a pago legal.

Esperado: no bloquear por la mera posibilidad; cláusula debe mantener carácter extraordinario.

## Caso 7 — Salario inferior a ZLFN

Datos:
- Tijuana, 2026;
- ocupación sin mínimo profesional superior;
- salario pactado $400 diarios.

Esperado: `BLOQUEADO` por ser inferior a $440.87 diarios.

## Caso 8 — Ocupación profesional ambigua

Datos:
- Tijuana, 2026;
- puesto denominado de forma genérica, pero funciones podrían corresponder a una ocupación del catálogo profesional;
- salario por encima del mínimo general pero no se puede determinar con certeza el profesional.

Esperado: `LISTO_PARA_REVISION`, no `COMPLETO`, hasta clasificar ocupación.

## Caso 9 — Faltan RFC y beneficiarios

Datos:
- resto de condiciones completas;
- RFC del trabajador no proporcionado;
- beneficiarios no capturados.

Esperado: `BORRADOR_INCOMPLETO`; puede guardarse, pero no presentarse como contrato completo.

## Caso 10 — “Sin IMSS por acuerdo”

Datos:
- patrón selecciona una opción/intenta escribir que trabajador acepta no ser inscrito.

Esperado: el producto no debe ofrecer ni aceptar esa opción como exención. Mantener la obligación externa y, en su caso, registrar `TRAMITE_PENDIENTE` o `NO_INFORMADO`.

## Caso 11 — Teletrabajo 60%

Datos:
- 60% desde domicilio elegido por trabajador;
- faltan equipo, fórmula de costos y mecanismos de supervisión.

Esperado: `BLOQUEADO` para contrato de teletrabajo completo hasta capturar los elementos requeridos.

## Caso 12 — Híbrido 40% exacto

Datos:
- 40% remoto y 60% centro de trabajo;
- no existen otras circunstancias que activen teletrabajo.

Esperado: no activar automáticamente Capítulo XII Bis sólo por la etiqueta “híbrido”.

## Caso 13 — Menor de edad

Datos:
- trabajador de 17 años;
- demás datos aparentemente válidos.

Esperado: `LISTO_PARA_REVISION` / `REQUIERE_REVISION_ESPECIAL`; activar reglas específicas de trabajo de menores antes de emisión final.

## Caso 14 — No competencia post-empleo

Datos:
- usuario solicita impedir que trabajador se emplee con competidores durante dos años después de terminar.

Esperado: `REQUIERE_REVISION_ESPECIAL`; no insertar automáticamente la cláusula en V1.

## Caso 15 — Confidencialidad legítima

Datos:
- puesto accede a listas de clientes, procesos internos o información identificable como confidencial/secreto industrial;
- cláusula se limita a información protegible y no impide denuncias ni derechos laborales.

Esperado: cláusula condicional permitida, sujeta a datos concretos.

## Caso 16 — Prestación inferior al mínimo

Datos:
- prima vacacional 20%; o aguinaldo 10 días.

Esperado: `BLOQUEADO`; el sistema debe elevar al mínimo legal o exigir corrección, nunca generar como válido.

## Caso 17 — Prestación superior al mínimo

Datos:
- prima vacacional 35%; aguinaldo 30 días.

Esperado: permitido; contrato debe conservar la mejora.

## Caso 18 — Aviso de privacidad pendiente

Datos:
- contrato laboral completo;
- estado de aviso de privacidad `AVISO_PENDIENTE`.

Esperado: no inventar que ya fue entregado. El contrato puede reflejar estado operativo, manteniendo la obligación separada; el producto debe mostrar pendiente de cumplimiento de datos.

## Caso 19 — Contradicción de respuestas

Datos:
- usuario declara “100% presencial” y después “trabajo remoto 3 días de 5 desde casa”.

Esperado: no resolver por suposición. Marcar contradicción y solicitar corrección antes de `COMPLETO`.

## Caso 20 — Trabajo especial

Datos:
- persona trabajadora del hogar, plataforma digital, campo u otro régimen especial identificado.

Esperado: `REQUIERE_REVISION_ESPECIAL`; no hacer pasar silenciosamente el caso por el contrato general V1.

## Caso 21 — Capacitación inicial + periodo a prueba sucesivos

Datos:
- usuario intenta aplicar capacitación inicial y después un periodo a prueba al mismo trabajador para el mismo puesto.

Esperado: `BLOQUEADO`/revisión por las restricciones de los arts. 39-C y 39-D; no concatenar figuras automáticamente.

## Caso 22 — Continuidad después de prueba

Datos:
- periodo a prueba válido concluye;
- trabajador continúa laborando.

Esperado: relación se considera por tiempo indeterminado y el periodo cuenta para antigüedad conforme al régimen aplicable.

## Caso 23 — Funciones excesivamente abiertas

Datos:
- funciones: “cualquier actividad que ordene el patrón”.

Esperado: `BLOQUEADO` para contrato completo; exigir descripción del servicio con precisión razonable.

## Caso 24 — Pago mensual a trabajador material

Datos:
- trabajo material;
- pago mensual.

Esperado: `BLOQUEADO` por periodicidad incompatible con art. 88; orientar al plazo legal aplicable.

## Caso 25 — Producción de borrador con pendientes

Datos:
- varios campos del art. 25 faltantes.

Esperado: permitir previsualización con marca visible `BORRADOR_INCOMPLETO` y lista de pendientes; nunca eliminar silenciosamente campos ni declarar cumplimiento.

## Criterio de salida de pruebas jurídicas

Antes de considerar cerrada la fase jurídica/producto V1:

1. todos los casos anteriores deben tener una regla documentada que produzca el resultado esperado;
2. cualquier caso sin respuesta segura debe pasar a `REQUIERE_REVISION_ESPECIAL`;
3. no debe existir una ruta que permita `COMPLETO` con salario inferior al mínimo, figura temporal sin causa, jornada ilegal, prestaciones inferiores a mínimos o campos obligatorios ausentes;
4. el contrato base debe renderizar únicamente las cláusulas aplicables al escenario seleccionado.
