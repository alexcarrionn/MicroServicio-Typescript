---
name: Nuevo algoritmo
about: Implementa uno de los algoritmos pendientes del microservicio
title: "[ALGO] "
labels: ["enhancement", "good first issue"]
---

## Algoritmo y comportamiento esperado

<!-- Nombre canónico en minúsculas y resultado que debe producir. Añade los casos límite o restricciones relevantes. -->

## Contrato de entrada

- **Qué significa `size`:**
- **Tipo y distribución de entrada:**
- **Resultado esperado y modificación de la entrada:**
- **Restricciones o casos límite:**

<!-- Para ordenar, indica si debe usarse el Int32Array aleatorio común. Para otros algoritmos, especifica el generador y la forma de la entrada. -->

## Complejidad y variante esperadas

- **Tiempo (mejor / medio / peor, si aplica):**
- **Memoria adicional:**
- **Variante o decisiones requeridas:**

## Criterios de aceptación

- [ ] `src/algorithms/<nombre>.ts` implementa `Algorithm<TInput>` con el nombre canónico indicado.
- [ ] `generateInput(size)` genera una entrada conforme a este issue; la generación queda fuera del cronómetro.
- [ ] Se registra en `src/algorithms/registry.ts` y aparece en `GET /api/v1/algorithms`.
- [ ] Hay tests en `tests/unit/<nombre>.test.ts` para el comportamiento, casos límite y tamaño de entrada definidos aquí.
- [ ] Se crea `docs/<nombre>.md` siguiendo la [plantilla de documentación de algoritmos](https://github.com/alexcarrionn/MicroServicio-Typescript/blob/main/docs/plantilla-algoritmo.md).
- [ ] Se comprueba el benchmark con dos o tres tamaños y se incluyen las salidas en el PR.
- [ ] No se modifica el contrato común de la API.

> Antes de empezar, comenta en este issue y espera a que te lo asignemos. Documenta la implementación con la plantilla enlazada y sigue la [guía para añadir algoritmos](https://github.com/alexcarrionn/MicroServicio-Typescript/blob/main/.github/CONTRIBUTING.md#6-cómo-añadir-un-algoritmo).
