# Generador de Contratos Laborales México

Proyecto independiente para construir una plataforma web que genere contratos laborales en México mediante un cuestionario sencillo, reglas jurídicas versionadas y documentos claros.

## Estado actual

**Fase 1 — implementación técnica del MVP (24 de agosto de 2026).**

La fase jurídica/producto V1 quedó documentada en PR #2 y el propietario autorizó expresamente pasar a implementación.

La instrucción anterior de “no programar todavía la aplicación” queda sustituida por esta fase.

Prioridad de implementación:

1. mantener como fuente canónica la matriz legal, cuestionario/bloqueos, contrato base, salarios 2026, casos especiales, readiness y handoff del PR #2;
2. implementar esquema de datos y snapshots/versionado histórico;
3. implementar motor determinista de reglas;
4. implementar cuestionario y estados `BORRADOR_INCOMPLETO`, `LISTO_PARA_REVISION`, `COMPLETO`, `BLOQUEADO`;
5. implementar resolución de salario mínimo por fecha + municipio + ocupación/funciones;
6. implementar selección de cláusulas y renderizado del contrato/PDF;
7. convertir los 25 casos jurídicos en pruebas automatizadas y agregar casos de borde;
8. implementar autenticación, autorización, aislamiento y controles de privacidad;
9. validar backup/restore, observabilidad y operación en VPS;
10. sólo declarar `LISTO PARA PRODUCCION` cuando todos los gates estén verdes.

## Principios no negociables

- Mercado inicial: México.
- Primera versión jurídica: reglas vigentes en 2026, con versionamiento anual.
- Contratos sencillos, profesionales y entendibles; no documentos inflados artificialmente.
- La IA puede asistir con lenguaje, clasificación o detección de contradicciones, pero **no inventa la ley**.
- La lógica jurídica vive en reglas, plantillas y cláusulas aprobadas/versionadas.
- La informalidad **no** se presenta como mecanismo para eliminar derechos u obligaciones legales.
- IMSS no bloquea por sí solo la generación del contrato, pero omitirlo del documento no implica que una obligación legal deje de existir.
- No generar recibos fiscales falsos ni convertir el MVP en sistema de nómina.
- No usar contratos por tiempo determinado sin validar la causa jurídicamente correspondiente.
- No usar cláusulas para renunciar a derechos irrenunciables.
- Cuando exista incertidumbre jurídica, marcar `REQUIERE_REVISION_ESPECIAL` en vez de asumir.
- Conservar históricamente versión de reglas, plantilla, respuestas, fecha y documento final de cada contrato generado.

## Gates duros del motor

Nunca permitir `COMPLETO` cuando exista cualquiera de estos supuestos:

- datos obligatorios faltantes;
- temporalidad sin causa válida;
- jornada ordinaria ilegal;
- salario inferior al mínimo general/profesional aplicable;
- prestaciones inferiores a mínimos legales;
- teletrabajo especial incompleto;
- caso marcado `REQUIERE_REVISION_ESPECIAL` sin resolución humana.

## Modelo comercial

- Cuenta gratuita.
- Pago por uso mediante créditos; no SaaS mensual obligatorio.
- `1 crédito = 1 contrato/persona`.
- Precio de referencia inicial: **$149 MXN por contrato**.
- Paquetes de volumen por definir.
- El crédito se consume al finalizar/generar el contrato definitivo, no al iniciar un borrador.

## Flujo del producto

```text
RESPUESTAS DEL USUARIO
        ↓
VALIDADOR
        ↓
MOTOR DE REGLAS VERSIONADO
        ↓
SELECCIÓN DE CLÁUSULAS
        ↓
DOCUMENTO
        ↓
PDF
        ↓
SNAPSHOT / VERSIÓN HISTÓRICA
```

No se acepta:

```text
prompt libre de IA → “hazme un contrato” → PDF
```

## Acceso operativo al VPS — mecanismo canónico

Este proyecto usa un solo **GPT VPS Runner global**. El protocolo central está en `Laynito/contaneo`:

- `docs/GPT-VPS-RUNNER.md`
- `runner-manifest.json`
- mailbox: Issue #8 `[GPT VPS RUNNER] Control queue`

Flujo:

```text
ChatGPT/Codex → GitHub mailbox → GPT VPS Runner → VPS → resultado en GitHub
```

### Incidente de onboarding detectado 24-08-2026

GitHub ya registra `contrato`, pero el runner físico todavía responde `UNKNOWN_PROJECT` porque mantiene un registro local separado en:

`/home/hermes/.gpt-runner/config/projects.json`

El servicio físico es:

`gpt-vps-runner.service`

El mailbox actual no permite leer/escribir rutas fuera del repositorio (`path escapes repository`), por lo que este incidente debe resolverse en el propio runner global agregando una capacidad segura de sincronización/registro; **no** reconstruir el daemon viejo.

### Legado retirado — NO USAR

No buscar, reactivar ni recrear:

- `.hermes-autopilot.json`;
- `[HERMES AUTO]`;
- `HERMES_JOB`;
- bridges/daemons por proyecto;
- GitHub Actions o runners hospedados por GitHub.

## Reglas de trabajo

- trabajar en branch/worktree aislado;
- cambios relevantes mediante PR;
- **no hacer merge a `main` ni desplegar sin autorización del propietario**;
- no tocar producción de otros proyectos;
- nada de GitHub Actions/workflows/runners;
- mantener trazabilidad jurídica y técnica;
- dejar un aviso de avance como mínimo cada hora con estado, hallazgos, bloqueos, siguiente paso y brecha a producción.

## Objetivo inmediato

Implementar el MVP siguiendo `docs/legal/contrato-v1-handoff-implementacion.md` y cerrar en paralelo el onboarding físico de `contrato` en el GPT VPS Runner global.