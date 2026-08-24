# Generador de Contratos Laborales México

Proyecto independiente para construir una plataforma web que genere contratos laborales en México mediante un cuestionario sencillo, reglas jurídicas versionadas y documentos claros.

## Estado actual

**Fase 0 — definición jurídica y de producto (agosto de 2026).**

Todavía **no se programa la aplicación**. El siguiente entregable es:

> **Contrato Individual de Trabajo V1 — Matriz legal de requisitos y árbol de decisión**

Orden de trabajo aprobado:

1. Investigación jurídica con fuentes oficiales mexicanas vigentes.
2. Matriz `Campo | clasificación | fuente | regla | pregunta para usuario`.
3. Árbol de decisión para determinar el tipo de relación/contrato.
4. Cuestionario completo.
5. Contrato Individual de Trabajo V1.
6. Variantes: indeterminado, determinado, temporada, periodo de prueba y capacitación inicial.
7. Anexos.
8. Protección de datos, privacidad y derechos ARCO.
9. Modelo final de créditos/precios.
10. Diseño técnico del MVP.

## Principios no negociables

- Mercado inicial: México.
- Primera versión jurídica: reglas vigentes en 2026, con versionamiento anual.
- Contratos sencillos, profesionales y entendibles; no documentos inflados artificialmente.
- La IA puede asistir con lenguaje, clasificación o detección de contradicciones, pero **no inventa la ley**.
- La lógica jurídica debe vivir en reglas, plantillas y cláusulas aprobadas/versionadas.
- Los negocios pequeños o con formalización pendiente pueden iniciar el flujo sin exigir estructura corporativa inexistente.
- La informalidad **no** se presenta como mecanismo para eliminar derechos u obligaciones legales.
- IMSS no bloquea por sí solo la generación del contrato, pero omitirlo del documento no implica que una obligación legal deje de existir.
- No generar recibos fiscales falsos ni convertir el MVP en sistema de nómina.
- No usar contratos por tiempo determinado sin validar la causa que jurídicamente corresponda.
- No usar cláusulas para renunciar a derechos irrenunciables ni copiar no-competencias estadounidenses de forma superficial.
- Cuando exista incertidumbre jurídica, marcar `REQUIERE REVISIÓN` en vez de asumir.
- Conservar históricamente la versión de reglas, plantilla, respuestas y documento final de cada contrato generado.

## Modelo comercial ya decidido

- Cuenta gratuita.
- Pago por uso mediante créditos; no SaaS mensual obligatorio.
- `1 crédito = 1 contrato/persona`.
- Precio de referencia inicial: **$149 MXN por contrato**.
- Paquetes de 5, 10 y posteriores con descuento, precios aún por validar.
- El crédito se consume al finalizar/generar el contrato definitivo, no por iniciar un borrador.

## Entregable jurídico V1

Para cada dato, regla y cláusula debe distinguirse entre:

- `OBLIGATORIO POR LEY`
- `RECOMENDADO`
- `OPCIONAL`
- `CONDICIONAL`
- `NO CONVIENE PREGUNTAR EN ESTE FLUJO`
- `REQUIERE REVISIÓN ESPECIAL`

Cada conclusión jurídica debe enlazarse a una fuente verificable. Priorizar fuentes oficiales mexicanas y no inventar artículos, requisitos ni vigencias.

## Flujo conceptual

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

No se acepta como arquitectura jurídica:

```text
prompt libre de IA → "hazme un contrato" → PDF
```

## Trabajo mediante Hermes Autopilot

Este repositorio está preparado para trabajar mediante el bridge **GitHub → VPS → Hermes → GitHub PR**.

Los trabajos deben abrirse como Issues con título:

```text
[HERMES AUTO] <tarea>
```

y un envelope `HERMES_JOB` válido.

Reglas del proyecto:

- trabajar en branch/worktree aislado;
- cambios relevantes mediante PR;
- no hacer merge a `main` sin autorización del propietario;
- no tocar producción;
- durante esta fase, producir investigación, matrices y especificaciones, **no código de la aplicación**;
- dejar evidencia de fuentes y de decisiones;
- si un trabajo dura más de una hora, debe dejar **un aviso de avance como mínimo cada hora** en el Issue de trabajo, indicando estado, hallazgos, bloqueos y siguiente paso; nunca esperar hasta el final para reportar una ejecución larga.

## Próxima tarea

**Contrato Individual de Trabajo V1 — Matriz legal de requisitos y árbol de decisión.**

Debe comenzar con investigación de fuentes oficiales vigentes en 2026 y terminar en documentación revisable dentro del repositorio. El diseño técnico de la aplicación viene después.
