import type { Algorithm } from "./types.js";
import { randomInt32Array } from "../benchmark/input.js";

export const insertionsort: Algorithm<Int32Array> = {
  name: "insertionsort",

  generateInput(size: number) {
    return randomInt32Array(size);
  },

  run(input) {
    insertionSort(input);
  },
};

export function insertionSort(a: Int32Array): void {
  for (let i = 1; i < a.length; i++) {
    const current = a[i];
    let j = i - 1;

    while (j >= 0 && a[j] > current) {
      a[j + 1] = a[j];
      j--;
    }

    a[j + 1] = current;
  }
}
