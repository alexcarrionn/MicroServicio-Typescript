#!/bin/sh
# Prueba de humo contra una instancia en marcha del microservicio (local o en
# contenedor). Comprueba que los endpoints cumplen el contrato común.
#
# Uso: sh scripts/comprobar-api.sh [URL_BASE]   (por defecto http://localhost:3000)
# Necesita curl y jq.

BASE_URL="${1:-http://localhost:3000}"
fallos=0

ok() { echo "  ✔ $1"; }
ko() { echo "  ✘ $1"; fallos=$((fallos + 1)); }

# Hace una petición y deja el cuerpo en $body y el código HTTP en $status.
peticion() {
  metodo="$1"
  ruta="$2"
  datos="$3"
  if [ -n "$datos" ]; then
    respuesta=$(curl -s -w '\n%{http_code}' -X "$metodo" "$BASE_URL$ruta" \
      -H "Content-Type: application/json" -d "$datos")
  else
    respuesta=$(curl -s -w '\n%{http_code}' -X "$metodo" "$BASE_URL$ruta")
  fi
  status=$(printf '%s\n' "$respuesta" | tail -n 1)
  body=$(printf '%s\n' "$respuesta" | sed '$d')
}

# Comprueba el código HTTP y una expresión jq sobre el cuerpo.
comprobar() {
  descripcion="$1"
  esperado="$2"
  filtro="$3"
  if [ "$status" != "$esperado" ]; then
    ko "$descripcion (HTTP $status, se esperaba $esperado): $body"
  elif ! printf '%s' "$body" | jq -e "$filtro" >/dev/null 2>&1; then
    ko "$descripcion (respuesta inesperada): $body"
  else
    ok "$descripcion"
  fi
}

echo "Prueba de humo contra $BASE_URL"

peticion GET /health
comprobar "GET /health responde {\"status\":\"UP\"}" 200 '.status == "UP"'

peticion GET /api/v1/algorithms
comprobar "GET /api/v1/algorithms incluye mergesort" 200 \
  '.algorithms | index("mergesort") != null'

peticion POST /api/v1/benchmark '{"algorithm":"mergesort","size":1000}'
comprobar "POST /api/v1/benchmark cumple el contrato" 200 '
  .language == "typescript"
  and .algorithm == "mergesort"
  and .size == 1000
  and .runs == 5
  and (.timeMs | type == "number" and . >= 0)'

peticion POST /api/v1/benchmark '{"algorithm":"mergesort","size":0}'
comprobar "size 0 devuelve 400 con JSON de error" 400 '.error != null'

peticion POST /api/v1/benchmark '{"algorithm":"mergesort","size":-5}'
comprobar "size negativo devuelve 400" 400 '.error != null'

peticion POST /api/v1/benchmark '{"algorithm":"mergesort","size":1.5}'
comprobar "size decimal devuelve 400" 400 '.error != null'

peticion POST /api/v1/benchmark '{"algorithm":"noexiste","size":10}'
comprobar "algoritmo desconocido devuelve 400" 400 '.error != null'

peticion POST /api/v1/benchmark '{"algorithm":'
comprobar "JSON mal formado devuelve 400" 400 '.error != null'

if [ "$fallos" -gt 0 ]; then
  echo "Han fallado $fallos comprobaciones."
  exit 1
fi
echo "Todas las comprobaciones han pasado."
