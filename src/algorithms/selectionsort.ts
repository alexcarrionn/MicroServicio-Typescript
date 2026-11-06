import type { Algorithm } from "./types.js";
import { randomInt32Array } from "../benchmark/input.js";

/**
 * SelectionSort clásico sobre un `Int32Array`.
 *
 * En cada pasada busca el mínimo de la parte sin ordenar y lo intercambia con
 * la primera posición de esa parte. Ordena sin arrays auxiliares.
 */
export const selectionsort: Algorithm<Int32Array> = {
  name: "selectionsort",

  generateInput(size: number) {
    return randomInt32Array(size);
  },

  run(input) {
    selectionSort(input);
  },
};

export function selectionSort(a: Int32Array): void {
  for (let i = 0; i < a.length - 1; i++) {
    let min = i;
    for (let j = i + 1; j < a.length; j++) {
      if (a[j] < a[min]) min = j;
    }

    if (min !== i) {
      const tmp = a[i];
      a[i] = a[min];
      a[min] = tmp;
    }
  }
}
