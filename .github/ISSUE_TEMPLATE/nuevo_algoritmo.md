---
name: Nuevo algoritmo
about: Implementa uno de los algoritmos pendientes del microservicio
title: "[ALGO] "
labels: ["enhancement", "good first issue"]
---

## Algoritmo
<!-- Nombre canónico en minúsculas: es el valor que aceptará el campo "algorithm". Ej.: quicksort -->

## Qué significa `size`
<!-- Ej.: número de elementos del Int32Array que se ordena. -->

## Complejidad esperada
- Temporal:
- Espacial:
<!-- Ej.: O(n log n) en promedio, O(log n) de pila; ordenación in situ. -->

## Variante o detalles de implementación
<!-- Ej.: partición de Lomuto, pivote aleatorio... Opcional. -->

## Criterios de aceptación
- [ ] `src/algorithms/<nombre>.ts` implementa la interfaz `Algorithm` y usa `randomInt32Array` para generar la entrada.
- [ ] Ordena in situ, sin crear arrays nuevos en cada paso.
- [ ] Registrado en `src/algorithms/registry.ts` y visible en `GET /api/v1/algorithms`.
- [ ] Tests en `tests/unit/<nombre>.test.ts`: vacío, un elemento, ordenado, inverso, repetidos y aleatorio grande contra `Array.prototype.sort`.
- [ ] El PR incluye la salida de `curl` para dos o tres tamaños distintos.

> Antes de empezar, comenta en este issue para que te lo asignemos. Los pasos están en la sección 6 de [CONTRIBUTING.md](https://github.com/alexcarrionn/MicroServicio-Typescript/blob/main/.github/CONTRIBUTING.md#6-cómo-añadir-un-algoritmo).
