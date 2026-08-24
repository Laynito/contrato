# Contrato MX — Runbook de producción V1

## Arquitectura

- Node.js 20+ sin dependencias npm de runtime.
- Proceso único detrás de nginx.
- Datos persistentes en `/var/lib/contrato/data.json` con escritura atómica.
- systemd con usuario dedicado `contrato` y filesystem endurecido.
- TLS terminado en nginx.

> Alcance V1: el almacenamiento JSON está diseñado para un solo proceso y un volumen inicial bajo/moderado. No ejecutar múltiples workers sobre el mismo archivo. Para crecimiento/multi-instancia, migrar el adaptador `Store` a PostgreSQL antes de escalar horizontalmente.

## Variables obligatorias

- `NODE_ENV=production`
- `HOST=127.0.0.1`
- `PORT=3080`
- `PUBLIC_ORIGIN=https://<dominio-real>`
- `SESSION_SECRET=<secreto aleatorio de al menos 32 caracteres>`
- `DATA_FILE=/var/lib/contrato/data.json`

La aplicación falla al arrancar en producción si falta `PUBLIC_ORIGIN` o un `SESSION_SECRET` adecuado.

## Preflight

1. Node >=20.
2. `node --check` de todos los archivos `src/`.
3. `npm test` verde.
4. `npm audit` sin vulnerabilidades (el runtime V1 no tiene dependencias npm externas).
5. Dominio real y certificado TLS.
6. Aviso de privacidad completado con responsable, domicilio y canal ARCO reales.
7. Usuario/grupo dedicado `contrato`.
8. `/var/lib/contrato` propiedad del usuario `contrato`, modo restrictivo.
9. Backup validado y prueba de restore documentada.

## Despliegue recomendado

- Código versionado en `/srv/contrato/releases/<sha>`.
- Symlink `/srv/contrato/current` apuntando al release aprobado.
- Variables sólo en `/etc/contrato/contrato.env` (modo 600), nunca en Git.
- Copiar `deploy/contrato.service` a systemd y activar únicamente después del preflight.
- Adaptar `deploy/nginx.conf` con dominio/certificados reales.
- `nginx -t` antes de reload.
- Healthcheck interno: `GET http://127.0.0.1:3080/health`.
- Healthcheck externo: `GET https://<dominio>/health`.

## Rollback

1. Apuntar `/srv/contrato/current` al release anterior.
2. Reiniciar servicio.
3. Verificar `/health`.
4. Restaurar datos sólo si hubo una migración/corrupción; el código V1 no debe modificar snapshots finalizados.

## Backup / restore

- `deploy/backup.sh`: copia atómica validada por JSON y retención configurable.
- `deploy/restore.sh`: valida JSON y conserva una copia pre-restore.
- Recomendación inicial: backup diario y adicional antes de cada despliegue.

## Gates jurídicos de producción

No considerar release aprobable si cualquier prueba permite `COMPLETO` con:

- campos obligatorios faltantes;
- tiempo determinado sin causa clasificada/documentada;
- jornada ordinaria por encima del máximo versionado;
- salario inferior al mínimo aplicable;
- prestaciones inferiores;
- teletrabajo >40% sin elementos requeridos;
- intento de renuncia a IMSS;
- casos de revisión especial convertidos silenciosamente a completos.

## Privacidad

`public/privacy.html` es una plantilla operativa, no debe publicarse como aviso integral definitivo hasta incorporar los datos reales del responsable y canal ARCO. Este punto es un gate de lanzamiento público.

## Observabilidad

- Logs estructurados mínimos por stdout/journald.
- No registrar payloads de contratos, CURP, RFC, domicilios, contraseñas ni cookies.
- Alertar por proceso caído y healthcheck no-200.

## Autorización

El despliegue final y el merge a `main` requieren autorización explícita del propietario. No usar GitHub Actions.
