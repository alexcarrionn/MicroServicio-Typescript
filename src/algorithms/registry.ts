import type { Algorithm } from "./types.js";
import { mergesort } from "./mergesort.js";
import { insertionsort } from "./insertionsort.js";
import { selectionsort } from "./selectionsort.js";
import { quicksort } from "./quicksort.js";
import { fibonacci } from "./fibonacci.js";

/** Algoritmos disponibles, indexados por su nombre canónico. */
export const registry = new Map<string, Algorithm>([
  [mergesort.name, mergesort],
  [insertionsort.name, insertionsort],
  [selectionsort.name, selectionsort],
  [quicksort.name, quicksort],
  [fibonacci.name, fibonacci],
]);
