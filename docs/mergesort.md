---
title: MergeSort
---

# MergeSort

MergeSort es el algoritmo de referencia del microservicio. Es un algoritmo de
ordenación por **divide y vencerás**:

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

## Implementación

Está en [`src/algorithms/mergesort.ts`](../src/algorithms/mergesort.ts). Es la
versión descendente (*top-down*) y trabaja sobre el `Int32Array` que genera
`randomInt32Array`:

- Reserva **un único buffer auxiliar** del tamaño de la entrada al principio y
  lo reutiliza en todas las mezclas. Crear arrays nuevos en cada llamada
  recursiva haría que se midiera el recolector de basura y no el algoritmo.
- En cada mezcla copia el tramo `[lo, hi]` al buffer auxiliar y vuelve a
  escribir el resultado sobre el array original, así que el array de entrada
  queda ordenado in situ.

## Propiedades

| Propiedad | Valor |
|-----------|-------|
| Tiempo, mejor caso | O(n log n) |
| Tiempo, caso medio | O(n log n) |
| Tiempo, peor caso | O(n log n) |
| Memoria adicional | O(n) |
| Estable | Sí |

### Tiempo: O(n log n) siempre

El array se divide siempre por la mitad, independientemente de los datos, así
que la recursión tiene log₂ n niveles. En cada nivel las mezclas recorren entre
todas los n elementos una vez. El coste es n · log₂ n en todos los casos: a
diferencia de QuickSort, no hay una entrada que lo degrade a O(n²), y tampoco
se beneficia de recibir el array ya ordenado.

### Memoria: O(n)

La mezcla necesita un espacio donde copiar los elementos, que es el buffer
auxiliar de tamaño n. A eso se suma la pila de la recursión, que es O(log n) y
por tanto despreciable frente al buffer.

### Estable

Un algoritmo es estable si los elementos iguales conservan su orden relativo.
En la mezcla, cuando los dos elementos comparados son iguales se toma siempre
el de la mitad izquierda, que es el que iba antes en el array original. Con
enteros esto no se aprecia, pero sí al ordenar registros por una clave.

## En el benchmark

Para `mergesort`, `size` es el número de elementos del array:

```bash
curl -X POST http://localhost:3000/api/v1/benchmark \
  -H "Content-Type: application/json" \
  -d '{"algorithm":"mergesort","size":100000}'
```

Al multiplicar `size` por 10, el tiempo debería crecer algo más de 10 veces
(el factor log n).
