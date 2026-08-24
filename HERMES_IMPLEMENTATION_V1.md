# Hermes — Implementación V1 hacia production-readiness

Fecha objetivo: 24-08-2026, antes de las 10:00 America/Tijuana.

## Misión

Tomar esta rama `work/implementacion-v1` como base canónica y llevar el proyecto desde la documentación jurídica/producto cerrada hasta una build funcional y técnicamente preparada para producción, sin rebajar gates legales ni seguridad.

Trabajar en una rama/worktree aislado propio, idealmente `hermes/implementacion-v1-prod-ready`. No modificar `main` directamente.

## Leer primero

- `AGENTS.md`
- `README.md`
- toda la documentación jurídica/producto existente en el repositorio
- Issue #1 y PR #2 como contexto de decisiones ya aprobadas

## Entrega grande — no microtareas

1. Elegir y documentar el stack más eficiente para este MVP.
2. Crear scaffold funcional de la aplicación.
3. Implementar autenticación y aislamiento de datos por usuario/cuenta.
4. Diseñar esquema de datos con snapshots y versionado de reglas, plantillas, respuestas y documento final.
5. Implementar motor determinista de reglas con estados `BORRADOR_INCOMPLETO`, `LISTO_PARA_REVISION`, `COMPLETO`, `BLOQUEADO`.
6. Implementar cuestionario guiado con validaciones fail-closed.
7. Implementar modalidades: indeterminado, determinado, obra, temporada, prueba y capacitación inicial conforme a la matriz.
8. Implementar jornada y horas extra 2026-2030, prestaciones mínimas, salario mínimo general/ZLFN/profesional 2026, teletrabajo >40%, IMSS como obligación externa, privacidad/ARCO y casos de revisión especial.
9. Implementar selección de cláusulas y renderizado de contrato.
10. Implementar PDF con snapshot inmutable del contrato generado.
11. Convertir los 25 casos jurídicos documentados en pruebas automatizadas.
12. Agregar pruebas técnicas críticas de autenticación, autorización, aislamiento, reglas, renderizado y errores.
13. Aplicar configuración segura, validación, manejo de errores y logs sin PII innecesaria.
14. Preparar healthcheck, configuración de despliegue, backup/restore, observabilidad y runbook de producción.
15. Ejecutar pruebas/gates disponibles y corregir fallas propias.
16. Hacer commits claros, push de la rama y abrir/actualizar PR revisable con evidencia de pruebas y bloqueos restantes.

## Reglas jurídicas innegociables

- No inventar ley.
- No degradar bloqueos jurídicos a warnings.
- No permitir `COMPLETO` con datos obligatorios faltantes.
- No permitir temporalidad sin causa válida.
- No permitir jornada ilegal.
- No permitir salario inferior al mínimo aplicable.
- No permitir prestaciones inferiores a mínimos legales.
- No permitir teletrabajo especial incompleto cuando aplique.
- Casos `REQUIERE_REVISION_ESPECIAL` no se fuerzan a completos.

## Reglas operativas

- No GitHub Actions.
- No force push.
- No exponer secretos.
- No tocar producción de otros proyectos.
- DeepSeek puede usarse fuera de las ventanas pico definidas por el proyecto; durante pico continuar trabajo que no requiera DeepSeek.
- Hacer pasos grandes y autónomos; no pedir confirmación por decisiones reversibles.
- Si un componente externo bloquea producción, completar todo lo demás y dejar un único bloqueo accionable.
- No mergear `main` ni ejecutar despliegue final a producción sin autorización explícita del propietario.

## Definición de salida

La ejecución termina cuando exista una build funcional, pruebas relevantes ejecutadas, PR revisable, runbook de despliegue y una evaluación honesta de production-readiness. Si no se logra 100%, dejar exactamente qué falta y cómo resolverlo.