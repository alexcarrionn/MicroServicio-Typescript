import type { Algorithm } from "./types.js";
import { randomInt32Array } from "../benchmark/input.js";

/**
 * MergeSort descendente (top-down) sobre un `Int32Array`.
 *
 * Usa un único buffer auxiliar del mismo tamaño que la entrada, reservado una
 * sola vez, para no medir el recolector de basura en cada mezcla.
 */
export const mergesort: Algorithm<Int32Array> = {
  name: "mergesort",

  generateInput(size: number) {
    return randomInt32Array(size);
  },

  run(input) {
    mergeSort(input);
  },
};

/** Ordena `a` in situ de forma ascendente y estable. */
export function mergeSort(a: Int32Array): void {
  if (a.length < 2) return;
  const aux = new Int32Array(a.length);
  sort(a, aux, 0, a.length - 1);
}

function sort(a: Int32Array, aux: Int32Array, lo: number, hi: number): void {
  if (lo >= hi) return;
  const mid = lo + ((hi - lo) >> 1);
  sort(a, aux, lo, mid);
  sort(a, aux, mid + 1, hi);
  merge(a, aux, lo, mid, hi);
}

/** Mezcla los tramos ordenados `a[lo..mid]` y `a[mid+1..hi]`. */
function merge(
  a: Int32Array,
  aux: Int32Array,
  lo: number,
  mid: number,
  hi: number,
): void {
  for (let k = lo; k <= hi; k++) aux[k] = a[k];

  let i = lo;
  let j = mid + 1;
  for (let k = lo; k <= hi; k++) {
    if (i > mid) a[k] = aux[j++];
    else if (j > hi) a[k] = aux[i++];
    // Con empate se toma el de la izquierda: eso hace que sea estable.
    else if (aux[j] < aux[i]) a[k] = aux[j++];
    else a[k] = aux[i++];
  }
}
