---
name: Informe de bug
about: Reporta un fallo en la aplicación
title: "[BUG] "
labels: ["bug", "triage"]
assignees: ["alexcarrionn"]
---

## Descripción
<!-- Qué ocurre. -->

## Pasos para reproducir
1.
2.

## Comportamiento esperado

## Comportamiento actual
<!-- Petición curl, código HTTP y JSON de error devuelto. -->
```shell
curl -i -X POST http://localhost:3000/api/v1/benchmark -H "Content-Type: application/json" -d '{"algorithm":"mergesort","size":10000}'

HTTP/1.1 500
{"status": 500, "error": "..."}
```

## Logs
<!-- Salida relevante de la consola de la aplicación (opcional). -->
```shell

```

## Entorno
- Versión de Node.js (`node -v`):
- Ejecución: [ ] `npm run dev`  [ ] Docker Compose  [ ] Imagen de GHCR (indica la etiqueta)
- Versión o commit del microservicio (`git rev-parse --short HEAD`):
