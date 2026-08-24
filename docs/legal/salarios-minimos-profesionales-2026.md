# Salarios mínimos profesionales 2026 — regla V1

> Fuente oficial: Resolución del H. Consejo de Representantes de la CONASAMI publicada en el DOF el 9 de diciembre de 2025, vigente a partir del 1 de enero de 2026.
>
> Alcance: regla de validación para el futuro motor de contratos. No sustituye la tabla oficial completa ni debe hardcodearse sin vigencia.

## Regla general 2026

- Zona del Salario Mínimo General (ZSMG): salario mínimo general de **$315.04 MXN diarios**.
- Zona Libre de la Frontera Norte (ZLFN): salario mínimo general de **$440.87 MXN diarios**.
- La resolución conserva **61 profesiones, oficios y trabajos especiales** con salario mínimo profesional.
- Para una ocupación incluida en el catálogo profesional, el mínimo aplicable es el valor profesional de la tabla oficial para la zona geográfica correspondiente; no debe validarse sólo contra el mínimo general.
- La propia resolución establece que, si el monto profesional calculado para ZLFN resultara inferior al de ZSMG, prevalece para ambas zonas el monto de ZSMG.

## Regla específica ZLFN 2026

En la tabla oficial 2026, para ZLFN, **59 de las 61 ocupaciones profesionales listadas quedan en $440.87 diarios**, coincidiendo con el mínimo general de la ZLFN.

Las dos excepciones visibles en la tabla oficial son:

| No. | Ocupación | ZLFN 2026 | ZSMG 2026 |
|---:|---|---:|---:|
| 47 | Reportero(a) en prensa diaria impresa | $705.46 | $705.46 |
| 48 | Reportero(a) gráfico(a) en prensa diaria impresa | $705.46 | $705.46 |

Por tanto, para **Tijuana, Baja California**, incluida expresamente en la ZLFN por la resolución:

1. resolver primero si la ocupación coincide de forma sustantiva con alguna de las 61 descripciones profesionales oficiales;
2. si no coincide, validar al menos **$440.87 diarios**;
3. si coincide con una ocupación profesional ordinaria de la tabla ZLFN, validar el valor profesional correspondiente (en 2026 normalmente $440.87 diarios);
4. si es reportero(a) de prensa diaria impresa o reportero(a) gráfico(a) de prensa diaria impresa, validar **$705.46 diarios**;
5. no deducir la ocupación únicamente por el nombre libre del puesto cuando exista ambigüedad: pedir funciones y mapearlas contra la descripción oficial.

## Campos/reglas para el cuestionario

| Campo | Tipo | Regla |
|---|---|---|
| municipio_principal_trabajo | BLOQUEANTE FINAL | Determina ZLFN vs ZSMG por tabla geográfica versionada |
| nombre_puesto | REQUERIDO | Etiqueta humana; no basta para decidir salario profesional |
| funciones_puesto | BLOQUEANTE FINAL | Se usan para decidir si encuadra en una de las 61 descripciones profesionales |
| ocupacion_profesional_conasami | REGLA DERIVADA | ID 1–61 o `NINGUNA`; si hay ambigüedad, `REQUIERE_REVISION` |
| salario_diario_equivalente | REGLA DERIVADA | Convertir la forma de pago pactada a equivalente diario para la validación mínima aplicable |
| salario_minimo_aplicable | REGLA DERIVADA | `max(minimo_general_zona, minimo_profesional_zona_si_aplica)` según fecha |

## Guardas

- No preguntar al usuario “¿qué salario mínimo te aplica?”. El sistema debe resolverlo por **fecha + municipio + ocupación**.
- No permitir emitir como `COMPLETO` un contrato cuyo salario pactado resulte inferior al mínimo aplicable.
- No asumir que todo puesto con un nombre parecido encuadra automáticamente en el salario profesional: usar la descripción oficial de funciones.
- El catálogo y montos deben estar versionados por fecha de vigencia; 2026 no debe quedar como valor permanente.
- Trabajos especiales (por ejemplo, personas trabajadoras del hogar o del campo) pueden requerir reglas laborales adicionales además del piso salarial y deben seguir marcados para flujo especial cuando corresponda.

## Fuente oficial trazable

- DOF / SIDOF — Resolución del H. Consejo de Representantes de la Comisión Nacional de los Salarios Mínimos, publicación 9-12-2025: https://sidof.segob.gob.mx/notas/docFuente/5775534
- CONASAMI — salarios mínimos vigentes a partir del 01-01-2026: https://www.gob.mx/conasami/articulos/se-publican-en-el-diario-oficial-de-la-federacion-los-salarios-minimos-vigentes-a-partir-del-1-de-enero-de-2026

## Pendiente de implementación futura

Importar las 61 descripciones oficiales como catálogo versionado y diseñar el mapeo ocupación/funciones → salario profesional sin depender de IA como única fuente de decisión. Ante baja confianza, el motor debe devolver `REQUIERE_REVISION` y no inventar una clasificación.
