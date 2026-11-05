---
title: "InsertionSort"
---

# InsertionSort

## Resumen

InsertionSort es un algoritmo de ordenación que construye progresivamente una secuencia ordenada. Recorre los elementos del array e inserta cada uno en la posición correspondiente dentro de la parte que ya está ordenada.

Se incorpora al microservicio para comparar su rendimiento con otros algoritmos, como MergeSort.

## Definición y comportamiento

El algoritmo recorre el array desde la segunda posición. Para cada elemento, desplaza hacia la derecha los elementos anteriores que sean mayores e inserta el valor en la posición adecuada.

El resultado es un array ordenado de menor a mayor.

Casos relevantes:

- Array vacío o con un único elemento: no necesita modificaciones.
- Array ya ordenado: no requiere desplazamientos.
- Array en orden inverso: requiere el máximo número de desplazamientos.
- Elementos repetidos: conserva su orden relativo, por lo que es estable.

## Contrato en este servicio

- **Nombre canónico:** `insertionsort`.
- **Significado de `size`:** número de elementos que se deben ordenar.
- **Entrada:** `Int32Array` de enteros aleatorios de 32 bits, generado mediante `randomInt32Array(size)`.
- **Resultado:** array ordenado ascendentemente, modificando la entrada original.

La API admite tamaños enteros positivos. La generación de la entrada se realiza fuera del cronómetro, de forma que únicamente se mide la ejecución del algoritmo.

## Estrategia y variante implementada

Se utiliza la variante clásica iterativa de InsertionSort:

1. Se comienza en el segundo elemento del array.
2. Se guarda el elemento actual en una variable temporal.
3. Se comparan los elementos anteriores, desplazando hacia la derecha los que sean mayores.
4. Se inserta el elemento guardado en la posición correspondiente.
5. Se repite hasta recorrer todo el array.

La implementación realiza la ordenación *in situ*, sin crear arrays auxiliares, y utiliza una comparación estricta (`>`) para mantener la estabilidad.

## Complejidad

| Caso | Tiempo | Memoria adicional |
|---|---|---|
| Mejor | O(n) | O(1) |
| Medio | O(n²) | O(1) |
| Peor | O(n²) | O(1) |

- **Mejor caso:** el array ya está ordenado y solo se realiza una comparación por elemento.
- **Caso medio:** se necesitan múltiples comparaciones y desplazamientos.
- **Peor caso:** el array está ordenado en sentido inverso y cada elemento debe desplazarse hasta el inicio.
- **Memoria adicional:** O(1), puesto que únicamente se utilizan variables auxiliares de tamaño constante.

## Correctitud y propiedades

En cada iteración, el prefijo del array procesado permanece ordenado.

El elemento actual se inserta en su posición correcta dentro de ese prefijo, manteniendo el orden de los elementos anteriores.

Al finalizar el recorrido, todos los elementos pertenecen al prefijo ordenado y, por tanto, el array completo queda ordenado.

Propiedades:

- **Estable:** mantiene el orden relativo de elementos iguales.
- **In situ:** modifica directamente el array original.
- **Determinista:** para una misma entrada produce siempre el mismo resultado.

## Implementación en este servicio

- **Código:** [`src/algorithms/insertionsort.ts`](../src/algorithms/insertionsort.ts).
- **Registro:** `src/algorithms/registry.ts`.
- **Tipo de entrada:** `Int32Array`.
- **Generación:** función común `randomInt32Array(size)`.
- **Ejecución:** función `insertionSort(input)`.

El algoritmo implementa la interfaz `Algorithm<Int32Array>` y queda disponible a través de los endpoints REST del microservicio.

No requiere modificaciones en el motor de benchmarking ni en los controladores HTTP.

## Tests

Los tests se encuentran en [`tests/unit/insertionsort.test.ts`](../tests/unit/insertionsort.test.ts).

Se comprueban los siguientes casos:

- Array vacío.
- Array de un elemento.
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
npm test -- tests/unit/insertionsort.test.ts
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
  -d '{"algorithm":"insertionsort","size":1000}'
```

El servicio devuelve la mediana de cinco ejecuciones en milisegundos (`timeMs`). Antes de medir, realiza una ejecución de calentamiento y genera las entradas fuera del cronómetro.

Resultados obtenidos en una sesión de pruebas local mediante peticiones a la API (mediana de cinco ejecuciones por tamaño):

| Tamaño (`size`) | Tiempo (`timeMs`) |
|---|---|
| 100 | 0.0855 ms |
| 1000 | 0.1427 ms |
| 5000 | 3.2979 ms |

Estas mediciones son orientativas y corresponden a una única petición por tamaño; no representan una media de varias sesiones ni garantizan tiempos idénticos en otros equipos.

InsertionSort presenta complejidad temporal O(n²) en el caso medio, por lo que su tiempo de ejecución tiende a crecer cuadráticamente al aumentar el tamaño de una entrada aleatoria.

Los tiempos reales dependen del hardware, del entorno de ejecución y de las características de los datos.

## Fuentes y referencias

- [Issue #13 — InsertionSort](https://github.com/alexcarrionn/MicroServicio-Typescript/issues/13).
- [Guía de contribución del proyecto](https://github.com/alexcarrionn/MicroServicio-Typescript/blob/main/.github/CONTRIBUTING.md).
- [Implementación de MergeSort del proyecto](https://github.com/alexcarrionn/MicroServicio-Typescript/blob/main/src/algorithms/mergesort.ts).
