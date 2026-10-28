---
title: "Nombre del algoritmo"
---

# Nombre del algoritmo

<!-- Copia este fichero como docs/<nombre-canonico>.md, actualiza title y sustituye las instrucciones. -->

## Resumen

<!-- Qué problema resuelve el algoritmo y por qué se incluye en el servicio. -->

## Definición y comportamiento

<!-- Describe el resultado esperado, las reglas relevantes y los casos límite. -->

## Contrato en este servicio

- **Nombre canónico:** `nombre` (el valor de `algorithm` en la API).
- **Significado de `size`:** <!-- Qué dimensión o cantidad representa. -->
- **Entrada:** <!-- Tipo, distribución y restricciones de los datos generados. -->
- **Resultado:** <!-- Qué calcula y si modifica la entrada. -->

La API solo admite tamaños enteros positivos. La generación de la entrada se
hace fuera del cronómetro; únicamente se mide la ejecución del algoritmo.

## Estrategia y variante implementada

<!-- Explica los pasos y la variante concreta (pivote, estructura, enfoque, etc.). -->

## Complejidad

| Caso | Tiempo | Memoria adicional |
|-------|--------|-------------------|
| Mejor | <!-- O(...) --> | <!-- O(...) --> |
| Medio | <!-- O(...) --> | <!-- O(...) --> |
| Peor | <!-- O(...) --> | <!-- O(...) --> |

<!-- Justifica el análisis. Si una distinción no aplica, indícalo. -->

## Correctitud y propiedades

<!-- Explica brevemente por qué el algoritmo produce el resultado esperado. Indica propiedades relevantes, como estabilidad o si modifica la entrada, cuando apliquen. -->

## Implementación en este servicio

- **Código:** [`src/algorithms/nombre.ts`](../src/algorithms/nombre.ts).
- **Registro:** `src/algorithms/registry.ts`.
- **Decisiones relevantes:** <!-- Asignaciones, estructuras auxiliares, recursión, etc. -->

## Tests

<!-- Enlaza tests/unit/nombre.test.ts y resume casos límite, propiedades y oráculos comprobados. -->

## Benchmark

```bash
curl -X POST http://localhost:3000/api/v1/benchmark \
  -H "Content-Type: application/json" \
  -d '{"algorithm":"nombre","size":10000}'
```

<!-- Explica cómo interpretar el crecimiento al variar size. Los tiempos dependen del entorno; no publiques un tiempo como garantía. -->

## Fuentes y referencias (opcional)

<!-- Añade fuentes consultadas o enlaces útiles, si los hay. -->
