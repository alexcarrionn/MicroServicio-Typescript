import type { Algorithm } from "./types.js";
import { mergesort } from "./mergesort.js";
import { insertionsort } from "./insertionsort.js";

/** Algoritmos disponibles, indexados por su nombre canónico. */
export const registry = new Map<string, Algorithm>([
  [mergesort.name, mergesort],
  [insertionsort.name, insertionsort],
]);
