import type { Algorithm } from "./types.js";
import { randomInt32Array } from "../benchmark/input.js";

/**
 * QuickSort con partición de Lomuto sobre un `Int32Array`.
 *
 * Ordena in situ, sin crear arrays en cada partición. El pivote es el elemento
 * central del tramo, para no caer en el peor caso con entradas ya ordenadas.
 */
export const quicksort: Algorithm<Int32Array> = {
  name: "quicksort",

  generateInput(size: number) {
    return randomInt32Array(size);
  },

  run(input) {
    quickSort(input);
  },
};

/** Ordena `a` in situ de forma ascendente. */
export function quickSort(a: Int32Array): void {
  sort(a, 0, a.length - 1);
}

function sort(a: Int32Array, lo: number, hi: number): void {
  while (lo < hi) {
    const p = partition(a, lo, hi);
    // Se recurre sobre el tramo menor y se itera sobre el mayor: así la pila
    // queda en O(log n) incluso cuando las particiones salen desequilibradas.
    if (p - lo < hi - p) {
      sort(a, lo, p - 1);
      lo = p + 1;
    } else {
      sort(a, p + 1, hi);
      hi = p - 1;
    }
  }
}

/**
 * Partición de Lomuto: deja el pivote en su posición definitiva, con los
 * menores a su izquierda y los mayores o iguales a su derecha, y la devuelve.
 */
function partition(a: Int32Array, lo: number, hi: number): number {
  const mid = lo + ((hi - lo) >> 1);
  swap(a, mid, hi);
  const pivot = a[hi];

  let i = lo;
  for (let j = lo; j < hi; j++) {
    if (a[j] < pivot) {
      swap(a, i, j);
      i++;
    }
  }
  swap(a, i, hi);
  return i;
}

function swap(a: Int32Array, i: number, j: number): void {
  const tmp = a[i];
  a[i] = a[j];
  a[j] = tmp;
}
