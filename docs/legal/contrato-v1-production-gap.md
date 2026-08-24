# Contrato V1 — Matriz de brechas hacia producción

> Estado al 24-08-2026. Este documento no autoriza implementación ni despliegue; traduce el estado jurídico/producto ya cerrado a un gate verificable de producción.

## 1. Resumen ejecutivo

La **fase jurídica/producto Contrato Individual V1** está lista para revisión y handoff. Eso no equivale a que la plataforma esté lista para producción.

Mientras `README.md` e Issue #1 mantengan la instrucción **NO programar todavía la aplicación**, el trabajo permitido se limita a documentación, revisión, criterios de aceptación y preparación del siguiente handoff.

La producción real requiere cerrar, como mínimo, las brechas de esta matriz y obtener autorización explícita del propietario antes de implementar/mergear/desplegar.

## 2. Gate por dominio

| Dominio | Estado | Evidencia actual | Falta para verde | Bloquea producción |
|---|---|---|---|---|
| Matriz legal V1 | VERDE PARA REVISIÓN | `contrato-individual-v1.md` | Revisión humana final/aprobación | Sí, hasta aprobación |
| Árbol de decisión | VERDE PARA REVISIÓN | `contrato-individual-v1.md` | Revisión humana final/aprobación | Sí, hasta aprobación |
| Cuestionario y bloqueos | VERDE PARA REVISIÓN | `contrato-v1-cuestionario-y-bloqueos.md` | Convertir después a reglas ejecutables | Sí |
| Contrato base | VERDE PARA REVISIÓN | `contrato-base-v1.md` | Renderizador + revisión del documento generado | Sí |
| Salarios mínimos 2026 | VERDE PARA REVISIÓN | `salarios-minimos-profesionales-2026.md` | Catálogo ejecutable versionado + pruebas | Sí |
| Casos especiales | VERDE PARA REVISIÓN | `contrato-v1-casos-especiales.md` | Rutas de derivación/revisión en producto | Sí |
| Casos jurídicos de prueba | VERDE COMO ESPECIFICACIÓN | `contrato-v1-casos-prueba.md` | Convertir 25 casos a pruebas automatizadas | Sí |
| Handoff de implementación | VERDE | `contrato-v1-handoff-implementacion.md` | Autorización para iniciar implementación | Sí |
| Motor de reglas | NO INICIADO | Prohibido por fase actual | Implementar tras autorización | Sí |
| Renderizador contractual | NO INICIADO | Prohibido por fase actual | Implementar + validación post-render | Sí |
| PDF final | NO INICIADO | Sólo flujo conceptual definido | Implementar + pruebas de fidelidad | Sí |
| Snapshots/versionado histórico | NO INICIADO | Requisitos definidos | Implementar persistencia inmutable/versionada | Sí |
| Autenticación/autorización | NO INICIADO | Gate definido | Diseñar, implementar y probar | Sí |
| Aislamiento de cuentas | NO INICIADO | Gate definido | Implementar y probar acceso cruzado negativo | Sí |
| Privacidad/ARCO | AMARILLO | Reglas jurídicas documentadas | Implementación operativa, retención, ejercicio de derechos | Sí |
| Logs/observabilidad segura | NO INICIADO | Restricción documentada | Implementar sin exposición de datos personales | Sí |
| Backup/restore | NO INICIADO | Gate definido | Prueba real de respaldo y restauración | Sí |
| VPS del proyecto | BLOQUEADO | Proyecto registrado en manifest; jobs `status` sin resultado | `GPT_RUNNER_RESULT` exitoso para `contrato` | Sí |
| DeepSeek/Hermes | NO REQUERIDO PARA V1 JURÍDICO | Manifest no expone acción | No bloquear producción si arquitectura no depende de ello | No por sí solo |
| Merge/despliegue | NO AUTORIZADO | Regla explícita del proyecto | Autorización del propietario | Sí |

## 3. Dependencias críticas en orden

```text
APROBACIÓN JURÍDICA/PRODUCTO V1
        ↓
AUTORIZACIÓN PARA PROGRAMAR
        ↓
VERIFICACIÓN GPT VPS RUNNER PARA `contrato`
        ↓
IMPLEMENTACIÓN DEL MOTOR DETERMINISTA
        ↓
CATÁLOGOS VERSIONADOS + ESTADOS/BLOQUEOS
        ↓
RENDERIZADOR + PDF + VALIDACIÓN POST-RENDER
        ↓
25 CASOS + BORDES EN VERDE
        ↓
SNAPSHOTS HISTÓRICOS
        ↓
SEGURIDAD / PRIVACIDAD / AISLAMIENTO
        ↓
BACKUP / RESTORE / OBSERVABILIDAD
        ↓
REVISIÓN HUMANA DEL DOCUMENTO REAL GENERADO
        ↓
AUTORIZACIÓN DE MERGE/DESPLIEGUE
        ↓
PRODUCCIÓN
```

No se debe invertir el orden de forma que un render o una IA “compense” reglas todavía no implementadas.

## 4. Criterios mínimos de aceptación técnica para la siguiente fase

Cuando se autorice programar, la primera implementación debe demostrar antes de ampliar alcance:

1. Puede cargar una versión explícita de reglas jurídicas.
2. Puede resolver los cuatro estados semánticos documentados sin atajos.
3. Rechaza tiempo determinado sin causa válida documentada.
4. Rechaza salario inferior al mínimo aplicable por fecha/municipio/ocupación.
5. Rechaza jornadas/prestaciones inferiores o superiores a límites aplicables según corresponda.
6. Deriva casos especiales a revisión en vez de inventar una solución.
7. Selecciona sólo cláusulas deterministas aprobadas.
8. Valida el documento después del render.
9. Conserva snapshot reproducible de reglas + respuestas + plantilla + resultado.
10. Ejecuta los 25 casos jurídicos como pruebas automatizadas.

Si cualquiera de estos puntos se sustituye por un prompt libre de IA, el gate falla.

## 5. Riesgos que no deben ocultarse para cumplir fecha

- `contrato` aún no tiene un resultado exitoso del GPT VPS Runner; el registro en el manifest no sustituye la prueba operativa.
- La aplicación todavía no existe como implementación autorizada; documentación lista no equivale a software listo.
- La revisión jurídica final del texto producido debe hacerse sobre un documento realmente renderizado, no sólo sobre la plantilla.
- Los controles de privacidad y seguridad deben probarse con datos sintéticos antes de almacenar información laboral real.
- Una fecha objetivo no convierte un gate rojo en verde.

## 6. Definición de “listo para producción”

Sólo se podrá marcar **LISTO PARA PRODUCCIÓN** cuando:

- todos los renglones marcados como bloqueantes estén en verde;
- los 25 casos jurídicos y pruebas de borde estén en verde;
- exista evidencia de validación VPS;
- exista evidencia de backup/restore y aislamiento;
- el documento final renderizado haya pasado revisión humana;
- el propietario haya autorizado explícitamente merge/despliegue.

Hasta entonces, usar uno de estos estados de proyecto: `JURIDICO_LISTO_PARA_REVISION`, `LISTO_PARA_IMPLEMENTACION`, `IMPLEMENTACION_EN_VALIDACION` o `BLOQUEADO_PARA_PRODUCCION`.