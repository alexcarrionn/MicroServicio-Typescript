---
title: "QuickSort"
---

# QuickSort

## Resumen

QuickSort es un algoritmo de ordenación basado en la estrategia **divide y vencerás**. Elige un elemento *pivote*, reorganiza el array para que los menores queden a su izquierda y los mayores a su derecha, y repite el proceso sobre cada lado.

Se incorpora al microservicio para comparar su rendimiento con el resto de algoritmos de ordenación (MergeSort, InsertionSort y SelectionSort) y con las implementaciones de QuickSort en otros lenguajes.

## Definición y comportamiento

Tras cada *partición*, el pivote queda en su posición definitiva. El mismo proceso se aplica a los tramos izquierdo y derecho hasta que tienen uno o ningún elemento.

El resultado es un array ordenado de menor a mayor.

Casos relevantes:

- Array vacío o con un único elemento: no se modifica.
- Array ya ordenado o en orden inverso: al tomar como pivote el elemento central, las particiones salen equilibradas y no se cae en el peor caso.
- Elementos repetidos: se ordenan correctamente, aunque con muchos valores iguales las particiones de Lomuto se desequilibran (ver [Complejidad](#complejidad)).

## Contrato en este servicio

- **Nombre canónico:** `quicksort`.
- **Significado de `size`:** número de elementos del `Int32Array` que se ordena.
- **Entrada:** `Int32Array` de enteros aleatorios de 32 bits, generado mediante `randomInt32Array(size)`.
- **Resultado:** el mismo array queda ordenado ascendentemente, sin perder ni añadir elementos.

La API solo admite tamaños enteros positivos. La generación de la entrada se
hace fuera del cronómetro; únicamente se mide la ejecución del algoritmo.

## Estrategia y variante implementada

Se usa el **particionado de Lomuto**, el recomendado en el issue:

1. Se toma como pivote el elemento central del tramo `a[lo..hi]` y se intercambia con el último.
2. Se recorre el tramo con un índice `j`, manteniendo un índice `i` que marca el final de la zona de elementos menores que el pivote. Cada vez que `a[j] < pivote`, se intercambian `a[i]` y `a[j]` y se avanza `i`.
3. Al terminar, se intercambia el pivote con `a[i]`: queda en su posición definitiva.
4. Se ordena recursivamente el tramo **más pequeño** y se continúa con un bucle sobre el más grande.

Toda la ordenación se hace *in situ*, sin crear arrays en ninguna partición.

## Complejidad

| Caso | Tiempo | Memoria adicional |
|-------|--------|-------------------|
| Mejor | O(n log n) | O(log n) |
| Medio | O(n log n) | O(log n) |
| Peor | O(n²) | O(log n) |

- **Tiempo:** cada nivel de partición recorre O(n) elementos. Con particiones equilibradas hay O(log n) niveles; con entradas aleatorias el caso esperado es O(n log n). El peor caso, O(n²), aparece cuando el pivote deja sistemáticamente un tramo vacío; con Lomuto ocurre, por ejemplo, si todos los elementos son iguales. Con la entrada aleatoria de 32 bits del servicio los repetidos son muy raros.
- **Memoria adicional:** solo la pila de recursión. Al recurrir siempre sobre el tramo menor, la profundidad queda acotada a O(log n) incluso en el peor caso (en lugar del O(n) de la recursión directa).

## Correctitud y propiedades

Tras `partition(a, lo, hi)`, que devuelve `p`, se cumple que `a[lo..p-1] < a[p] <= a[p+1..hi]`, así que `a[p]` está en su posición final. Como cada llamada fija al menos un elemento y reduce el tramo pendiente, el algoritmo termina, y ordenando ambos lados el tramo completo queda ordenado.

Propiedades:

- **No estable:** los intercambios a distancia pueden alterar el orden de elementos iguales. Con `Int32Array` no es observable.
- **In situ:** modifica directamente el array original.
- **Determinista:** el pivote es el elemento central, no aleatorio.

## Implementación en este servicio

- **Código:** [`src/algorithms/quicksort.ts`](../src/algorithms/quicksort.ts).
- **Registro:** `src/algorithms/registry.ts`.
- **Decisiones relevantes:**
  - Pivote central en lugar del último elemento, para evitar el peor caso con entradas ordenadas o inversas.
  - Recursión sobre el tramo menor e iteración sobre el mayor, para acotar la pila a O(log n) y no desbordarla con tamaños grandes.
  - Sin arrays auxiliares ni asignaciones por partición: solo se mide el algoritmo, no el recolector de basura.

## Tests

Los tests están en [`tests/unit/quicksort.test.ts`](../tests/unit/quicksort.test.ts) y cubren:

- Arrays vacío, unitario y de dos elementos.
- Array ya ordenado y en orden inverso.
- Elementos repetidos y negativos, y todos idénticos.
- Valores extremos de `Int32`.
- Ordenación in situ.
- Entradas grandes (100 000 elementos) ordenadas e inversas, sin desbordar la pila.
- Array aleatorio grande comparado con `Array.prototype.sort`.
- Generación de entradas del tamaño pedido.
- Registro del algoritmo con su nombre.

```bash
npm test -- tests/unit/quicksort.test.ts
```

## Benchmark

```bash
curl -X POST http://localhost:3000/api/v1/benchmark \
  -H "Content-Type: application/json" \
  -d '{"algorithm":"quicksort","size":10000}'
```

Resultados de una sesión de pruebas local (mediana de cinco ejecuciones por tamaño):

| Tamaño (`size`) | Tiempo (`timeMs`) |
|---|---|
| 10 000 | 0.87 ms |
| 100 000 | 14.77 ms |
| 1 000 000 | 151.29 ms |

Al multiplicar `size` por 10, el tiempo crece algo más de 10 veces, coherente con O(n log n). Con tamaños pequeños dominan los costes fijos. Los tiempos dependen del hardware y del entorno; son orientativos y no una garantía.

## Fuentes y referencias

- [Issue #17 — QuickSort](https://github.com/alexcarrionn/MicroServicio-Typescript/issues/17).
- [Quick Sort Algorithm — GeeksforGeeks](https://www.geeksforgeeks.org/dsa/quick-sort-algorithm/).
- [Quicksort — Algorithms, 4th Edition, Princeton](https://algs4.cs.princeton.edu/23quicksort/).
