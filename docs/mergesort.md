---
title: MergeSort
---

# MergeSort

## Resumen

MergeSort es el algoritmo de referencia del microservicio. Ordena una secuencia
de enteros mediante **divide y vencerás**, con tiempo O(n log n) en todos los
casos y espacio auxiliar O(n).

## Definición y comportamiento

El algoritmo ordena los elementos de menor a mayor. Divide la entrada en dos
mitades, ordena cada mitad de forma recursiva y combina las dos secuencias
ordenadas comparando sus primeros elementos pendientes:

1. **Dividir**: se parte el array en dos mitades.
2. **Vencer**: se ordena cada mitad de forma recursiva. Un tramo de cero o un
   elemento ya está ordenado, y ahí se detiene la recursión.
3. **Combinar**: se mezclan las dos mitades ordenadas en una sola, comparando
   en cada paso el primer elemento pendiente de cada una y tomando el menor.

```text
[38, 27, 43, 3, 9, 82, 10]
[38, 27, 43, 3]          [9, 82, 10]
[38, 27]   [43, 3]       [9, 82]   [10]
[27, 38]   [3, 43]       [9, 82]   [10]
[3, 27, 38, 43]          [9, 10, 82]
[3, 9, 10, 27, 38, 43, 82]
```

## Contrato en este servicio

- **Nombre canónico:** `mergesort`.
- **Significado de `size`:** número de elementos que se ordenan.
- **Entrada:** `Int32Array` con enteros aleatorios de 32 bits, generado por
  `randomInt32Array`.
- **Resultado:** el mismo array, ordenado de forma ascendente *in situ*.

La API requiere que `size` sea un entero positivo. La entrada se genera fuera
del cronómetro y solo se mide la llamada al algoritmo.

## Estrategia y variante implementada

La implementación es descendente (*top-down*): subdivide recursivamente cada
tramo hasta llegar a uno o cero elementos y luego mezcla los tramos ordenados.

## Complejidad

| Caso | Tiempo | Memoria adicional |
|-------|--------|-------------------|
| Mejor | O(n log n) | O(n) |
| Medio | O(n log n) | O(n) |
| Peor | O(n log n) | O(n) |

El array se divide siempre por la mitad, independientemente de los datos, así
que la recursión tiene log₂ n niveles. En cada nivel las mezclas recorren todos
los elementos una vez, con un coste total de O(n log n). Por eso el orden
inicial no mejora ni empeora la complejidad asintótica.

La mezcla necesita un buffer auxiliar de tamaño n. La pila de recursión ocupa
O(log n), por lo que el espacio adicional total sigue siendo O(n).

## Correctitud y propiedades

Cada llamada combina dos tramos ya ordenados y produce un tramo ordenado con
exactamente los mismos elementos. Por inducción, las llamadas recursivas
ordenan sus mitades y la mezcla final deja ordenado el tramo completo.

MergeSort es **estable**: cuando los elementos comparados son iguales, se toma
el de la mitad izquierda, que precedía al de la derecha en la entrada. La
implementación ordena el `Int32Array` de entrada *in situ*.

## Implementación en este servicio

El código está en [`src/algorithms/mergesort.ts`](../src/algorithms/mergesort.ts)
y el algoritmo se registra en `src/algorithms/registry.ts`.

- Reserva **un único buffer auxiliar** del tamaño de la entrada al principio y
  lo reutiliza en todas las mezclas. Crear arrays nuevos en cada llamada
  recursiva haría que se midiera el recolector de basura y no el algoritmo.
- En cada mezcla copia el tramo `[lo, hi]` al buffer auxiliar y vuelve a
  escribir el resultado sobre el array original, así que el array de entrada
  queda ordenado in situ.

## Tests

Los casos están en [`tests/unit/mergesort.test.ts`](../tests/unit/mergesort.test.ts):
entrada vacía y unitaria, entrada ordenada e inversa, duplicados y negativos,
un array aleatorio grande comparado con `Array.prototype.sort`, generación del
tamaño solicitado y registro del nombre.

## Benchmark

Para `mergesort`, `size` es el número de elementos del array. Por ejemplo:

```bash
curl -X POST http://localhost:3000/api/v1/benchmark \
  -H "Content-Type: application/json" \
  -d '{"algorithm":"mergesort","size":10000}'
```

El servicio devuelve la mediana de cinco ejecuciones medidas, en `timeMs`, y el
número de ejecuciones en `runs`. Al multiplicar `size` por 10, el tiempo puede
crecer algo más de 10 veces por el factor log n; los tiempos concretos dependen
del entorno y no son una garantía.
