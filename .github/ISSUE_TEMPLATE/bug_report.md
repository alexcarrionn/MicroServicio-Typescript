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
curl -i -X POST http://localhost:8080/api/tasks -H "Content-Type: application/json" -d '{...}'

HTTP/1.1 500
{"status": 500, "error": "..."}
```

## Logs
<!-- Salida relevante de la consola de la aplicación (opcional). -->
```shell

```

## Entorno
- Versión de Java (`java -version`):
- Versión o commit de tasky (`git rev-parse --short HEAD`):
