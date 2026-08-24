#!/usr/bin/env bash
set -Eeuo pipefail
if [ "$#" -ne 1 ]; then echo "Uso: $0 /ruta/backup.json" >&2; exit 2; fi
SRC="$1"
DEST="${DATA_FILE:-/var/lib/contrato/data.json}"
test -f "$SRC"
python3 -m json.tool "$SRC" >/dev/null
mkdir -p "$(dirname "$DEST")"
if [ -f "$DEST" ]; then cp -a "$DEST" "${DEST}.pre-restore.$(date -u +%Y%m%dT%H%M%SZ)"; fi
TMP="${DEST}.restore.$$"
cp "$SRC" "$TMP"
chmod 600 "$TMP"
mv "$TMP" "$DEST"
echo "Restored: $DEST"
