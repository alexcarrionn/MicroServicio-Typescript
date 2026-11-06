---
title: "SelectionSort"
---

# SelectionSort

## Resumen

SelectionSort es un algoritmo de ordenación que divide el array en una parte ya ordenada (al principio) y otra sin ordenar. En cada pasada selecciona el menor elemento de la parte sin ordenar y lo coloca al final de la parte ordenada.

Se incorpora al microservicio para comparar su rendimiento con otros algoritmos de ordenación, como MergeSort e InsertionSort.

## Definición y comportamiento

El algoritmo recorre el array desde la primera posición. En la pasada `i` busca el mínimo entre las posiciones `i` y la última, y lo intercambia con el elemento de la posición `i`.

El resultado es un array ordenado de menor a mayor.

Casos relevantes:

- Array vacío o con un único elemento: no necesita modificaciones.
- Array ya ordenado: realiza el mismo número de comparaciones que en cualquier otro caso, pero ningún intercambio.
- Array en orden inverso: es el caso con más intercambios, aunque nunca más de `n - 1`.
- Elementos repetidos: el intercambio a larga distancia puede alterar su orden relativo, por lo que no es estable.

## Contrato en este servicio

- **Nombre canónico:** `selectionsort`.
- **Significado de `size`:** número de elementos que se deben ordenar.
- **Entrada:** `Int32Array` de enteros aleatorios de 32 bits, generado mediante `randomInt32Array(size)`.
- **Resultado:** array ordenado ascendentemente, modificando la entrada original.

La API admite tamaños enteros positivos. La generación de la entrada se realiza fuera del cronómetro, de forma que únicamente se mide la ejecución del algoritmo.

## Estrategia y variante implementada

Se utiliza la variante clásica de SelectionSort con un único intercambio por pasada:

1. Se toma la primera posición de la parte sin ordenar como mínimo provisional.
2. Se recorre el resto de esa parte y se actualiza el índice del mínimo cuando se encuentra un valor menor.
3. Si el mínimo no está ya en la primera posición, se intercambia con ella.
4. Se avanza una posición el límite de la parte ordenada.
5. Se repite hasta que solo queda un elemento sin ordenar.

La implementación realiza la ordenación *in situ*, sin crear arrays auxiliares.

## Complejidad

| Caso | Tiempo | Memoria adicional |
|---|---|---|
| Mejor | O(n²) | O(1) |
| Medio | O(n²) | O(1) |
| Peor | O(n²) | O(1) |

- **Tiempo:** en todos los casos se realizan `n(n-1)/2` comparaciones, porque la búsqueda del mínimo recorre siempre el resto de la parte sin ordenar. El orden inicial de los datos no cambia ese número.
- **Intercambios:** como máximo `n - 1`.
- **Memoria adicional:** O(1), puesto que únicamente se utilizan variables auxiliares de tamaño constante.

## Correctitud y propiedades

Tras la pasada `i`, las posiciones `0..i` contienen los `i + 1` menores elementos del array, ya en su posición definitiva. En cada pasada se elige el menor de los restantes, que es mayor o igual que todos los anteriores.

Al terminar las `n - 1` pasadas, el último elemento es forzosamente el mayor y el array completo queda ordenado.

Propiedades:

- **No estable:** el intercambio puede mover un elemento por delante de otros iguales a él. Con `Int32Array` no es observable, porque dos enteros iguales son indistinguibles.
- **In situ:** modifica directamente el array original.
- **Determinista:** para una misma entrada produce siempre el mismo resultado.

## Implementación en este servicio

- **Código:** [`src/algorithms/selectionsort.ts`](../src/algorithms/selectionsort.ts).
- **Registro:** `src/algorithms/registry.ts`.
- **Tipo de entrada:** `Int32Array`.
- **Generación:** función común `randomInt32Array(size)`.
- **Ejecución:** función `selectionSort(input)`.

El algoritmo implementa la interfaz `Algorithm<Int32Array>` y queda disponible a través de los endpoints REST del microservicio.

No requiere modificaciones en el motor de benchmarking ni en los controladores HTTP.

## Tests

Los tests se encuentran en [`tests/unit/selectionsort.test.ts`](../tests/unit/selectionsort.test.ts).

Se comprueban los siguientes casos:

- Array vacío.
- Array de un elemento.
- Array de dos elementos.
- Array previamente ordenado.
- Array en orden inverso.
- Elementos repetidos y negativos.
- Elementos idénticos.
- Valores extremos de `Int32`.
- Ordenación in situ.
- Array aleatorio grande comparado con `Array.prototype.sort`.
- Generación de entradas del tamaño solicitado.
- Registro correcto del algoritmo.

Ejecutar los tests específicos:

```bash
npm test -- tests/unit/selectionsort.test.ts
```

Ejecutar todas las comprobaciones:

```bash
npm run format:check
npm run lint
npm test
npm run build
```

## Benchmark

Para ejecutar el benchmark, arrancar el servicio:

```bash
npm run dev
```

Realizar una petición:

```bash
curl -X POST http://localhost:3000/api/v1/benchmark \
  -H "Content-Type: application/json" \
  -d '{"algorithm":"selectionsort","size":1000}'
```

El servicio devuelve la mediana de cinco ejecuciones en milisegundos (`timeMs`). Antes de medir, realiza una ejecución de calentamiento y genera las entradas fuera del cronómetro.

Resultados obtenidos en una sesión de pruebas local mediante peticiones a la API (mediana de cinco ejecuciones por tamaño):

| Tamaño (`size`) | Tiempo (`timeMs`) |
|---|---|
| 100 | 0.0469 ms |
| 1000 | 0.3653 ms |
| 5000 | 8.5584 ms |

Estas mediciones son orientativas y corresponden a una única petición por tamaño; no representan una media de varias sesiones ni garantizan tiempos idénticos en otros equipos.

SelectionSort presenta complejidad temporal O(n²) en todos los casos, por lo que su tiempo de ejecución tiende a crecer cuadráticamente al aumentar el tamaño: al multiplicar `size` por 5 se espera un tiempo unas 25 veces mayor, aunque con tamaños pequeños dominan los costes fijos y el crecimiento observado es menor.

Los tiempos reales dependen del hardware, del entorno de ejecución y de las características de los datos.

## Fuentes y referencias

- [Issue #14 — SelectionSort](https://github.com/alexcarrionn/MicroServicio-Typescript/issues/14).
- [Guía de contribución del proyecto](https://github.com/alexcarrionn/MicroServicio-Typescript/blob/main/.github/CONTRIBUTING.md).
- [Implementación de MergeSort del proyecto](https://github.com/alexcarrionn/MicroServicio-Typescript/blob/main/src/algorithms/mergesort.ts).
