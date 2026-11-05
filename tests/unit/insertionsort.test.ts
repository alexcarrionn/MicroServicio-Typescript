import { describe, expect, it } from "vitest";
import {
  insertionSort,
  insertionsort,
} from "../../src/algorithms/insertionsort.js";
import { registry } from "../../src/algorithms/registry.js";

/** Ordena un Int32Array y devuelve sus elementos como array normal. */
function sorted(values: number[]): number[] {
  const input = Int32Array.from(values);
  insertionSort(input);
  return Array.from(input);
}

describe("insertionsort", () => {
  it("deja igual un array vacío", () => {
    expect(sorted([])).toEqual([]);
  });

  it("deja igual un array de un elemento", () => {
    expect(sorted([42])).toEqual([42]);
  });

  it("mantiene un array ya ordenado", () => {
    expect(sorted([1, 2, 3, 4, 5])).toEqual([1, 2, 3, 4, 5]);
  });

  it("ordena un array en orden inverso", () => {
    expect(sorted([5, 4, 3, 2, 1])).toEqual([1, 2, 3, 4, 5]);
  });

  it("ordena elementos repetidos y negativos", () => {
    expect(sorted([3, -1, 3, 0, -1, 2, 3])).toEqual([-1, -1, 0, 2, 3, 3, 3]);
  });

  it("ordena cuando todos los elementos son iguales", () => {
    expect(sorted([7, 7, 7, 7])).toEqual([7, 7, 7, 7]);
  });

  it("ordena los valores extremos de Int32", () => {
    expect(sorted([2147483647, 0, -2147483648, -1])).toEqual([
      -2147483648, -1, 0, 2147483647,
    ]);
  });

  it("ordena in situ sin sustituir el array original", () => {
    const input = Int32Array.from([4, 2, 3, 1]);
    const reference = input;

    const result = insertionSort(input);

    expect(result).toBeUndefined();
    expect(input).toBe(reference);
    expect(Array.from(input)).toEqual([1, 2, 3, 4]);
  });

  it("ordena un array aleatorio grande igual que Array.prototype.sort", () => {
    const input = insertionsort.generateInput(10_000);
    const expected = Array.from(input).sort((a, b) => a - b);

    insertionsort.run(input);

    expect(Array.from(input)).toEqual(expected);
  });

  it("genera un Int32Array del tamaño solicitado", () => {
    const input = insertionsort.generateInput(1000);

    expect(input).toBeInstanceOf(Int32Array);
    expect(input).toHaveLength(1000);
  });

  it("está registrado con su nombre canónico", () => {
    expect(insertionsort.name).toBe("insertionsort");
    expect(registry.get("insertionsort")).toBe(insertionsort);
  });
});
