# Contrato V1 — Readiness jurídico/producto

> Corte de revisión: 24-08-2026. Este documento cierra la fase jurídica/producto definida por el Issue #1 y separa con claridad lo que ya está listo de lo que pertenece a implementación técnica y producción real.

## 1. Resultado de la revisión cruzada

La matriz legal, el árbol de decisión, el cuestionario/bloqueos, el contrato base y los casos de prueba son internamente consistentes para el alcance V1.

No se encontró una ruta documentada que permita marcar `COMPLETO` cuando exista alguno de estos defectos:

- falta de datos obligatorios del artículo 25 LFT;
- tiempo determinado sin causa jurídica documentada;
- obra determinada sin objeto identificable;
- jornada ordinaria superior al máximo aplicable;
- salario inferior al mínimo general/profesional aplicable;
- prestaciones inferiores a mínimos legales;
- teletrabajo >40% sin elementos adicionales exigibles;
- contradicciones de respuestas o caso especial que exija revisión.

## 2. Checklist de cierre jurídico/producto V1

- [x] Matriz legal trazable a fuentes oficiales.
- [x] Árbol de decisión para indeterminado, determinado, obra, temporada, prueba y capacitación inicial.
- [x] Jornada y horas extraordinarias versionadas 2026-2030.
- [x] Salario mínimo general/ZLFN 2026 y regla de selección geográfica.
- [x] Catálogo/regla de salarios mínimos profesionales 2026.
- [x] Prestaciones mínimas y mejoras voluntarias.
- [x] IMSS tratado como obligación externa no renunciable.
- [x] Privacidad/ARCO separado del contrato y sin fingir cumplimiento.
- [x] Teletrabajo/híbrido y NOM-037 tratados condicionalmente.
- [x] Confidencialidad y secreto industrial acotados.
- [x] No competencia post-empleo derivada a revisión especial.
- [x] Menores y trabajos especiales derivados a revisión especial.
- [x] Propiedad intelectual laboral con regla base y escape a revisión especial.
- [x] Estados `BORRADOR_INCOMPLETO`, `LISTO_PARA_REVISION`, `COMPLETO`, `BLOQUEADO` definidos.
- [x] Contrato base parametrizable con cláusulas condicionales.
- [x] Casos de prueba jurídicos positivos y negativos documentados.
- [x] Regla explícita de no inventar cumplimiento ni completar faltantes con afirmaciones falsas.

## 3. Hallazgos de consistencia

### 3.1 Contrato base vs. cuestionario

El contrato base utiliza únicamente campos contemplados por la especificación o campos derivados de ellos. Los bloques condicionales relevantes (`TIEMPO_DETERMINADO`, `OBRA_DETERMINADA`, `TEMPORADA`, `PERIODO_A_PRUEBA`, `CAPACITACION_INICIAL`, `CONFIDENCIALIDAD`, `TELETRABAJO`, `PROPIEDAD_INTELECTUAL_SIMPLE`) tienen una regla de activación o derivación documentada.

### 3.2 Contrato base vs. casos de prueba

Los 25 casos cubren las rutas de mayor riesgo del V1: temporalidad sin causa, jornada ilegal, mínimo salarial, datos faltantes, IMSS, teletrabajo, menores, no competencia, prestaciones, privacidad, contradicciones, trabajos especiales, prueba/capacitación y periodicidad de pago.

### 3.3 Campos pendientes y emisión

Un dato faltante puede conservarse en `BORRADOR_INCOMPLETO`, pero ningún campo exigido para `COMPLETO` puede desaparecer silenciosamente del render final. Las obligaciones externas pendientes pueden mostrarse como estado operativo, sin convertir el contrato en constancia falsa de cumplimiento.

## 4. Condiciones para pasar de documentación a implementación

La fase jurídica/producto V1 está suficientemente definida para iniciar diseño técnico e implementación del motor de reglas, sujeto a que el propietario autorice salir de la restricción actual del Issue #1 de “NO programar todavía la aplicación”.

La siguiente fase debe convertir estas reglas en:

1. esquema de datos y validadores;
2. motor determinista de decisiones/estados;
3. catálogo salarial versionado por fecha y ubicación;
4. renderizador seguro del contrato;
5. pruebas automatizadas que materialicen los 25 casos jurídicos;
6. flujo de revisión especial sin emitir falsamente `COMPLETO`;
7. trazabilidad de versión jurídica utilizada para cada contrato generado.

## 5. Producción real — bloqueos objetivos actuales

No debe declararse el sistema “listo para producción” todavía por dos razones objetivas:

1. **Alcance aprobado:** el Issue #1 ordena explícitamente no programar todavía. La documentación está lista para pasar a diseño técnico, pero la aplicación/motor/renderizado aún no forman parte del entregable autorizado.
2. **GPT VPS Runner:** existen jobs `status` de `contrato` pendientes sin `GPT_RUNNER_RESULT`; hasta recibir respuesta no puede afirmarse que el proyecto está operativamente disponible en el VPS global.

Estos bloqueos no invalidan el cierre jurídico/producto; delimitan el comienzo de la fase técnica.

## 6. Gate de producción futura

Antes de producción deberán quedar en verde, como mínimo:

- implementación completa del motor de reglas;
- ejecución automatizada de los 25 casos y casos adicionales de borde;
- render final sin tokens ni campos vacíos;
- versionado de reglas jurídicas y salarios por fecha;
- revisión de seguridad y privacidad del almacenamiento de datos personales;
- validación de permisos/autenticación y aislamiento de documentos;
- estrategia de respaldo/recuperación;
- observabilidad y registro de errores sin exponer datos sensibles;
- revisión humana final de la plantilla y sus cláusulas especiales;
- validación operativa mediante GPT VPS Runner.

## 7. Estado final de esta fase

**JURÍDICO/PRODUCTO V1: LISTO PARA REVISIÓN Y PARA PASAR A DISEÑO TÉCNICO.**

**PRODUCCIÓN REAL: NO TODAVÍA**, por alcance técnico aún no autorizado/implementado y por la confirmación pendiente del GPT VPS Runner.
