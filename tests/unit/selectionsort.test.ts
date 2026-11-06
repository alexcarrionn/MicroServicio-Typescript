import { describe, expect, it } from "vitest";
import { registry } from "../../src/algorithms/registry.js";
import {
  selectionSort,
  selectionsort,
} from "../../src/algorithms/selectionsort.js";

function sorted(values: number[]): number[] {
  const a = Int32Array.from(values);
  selectionSort(a);
  return Array.from(a);
}

describe("selectionsort", () => {
  it("deja igual un array vacío", () => {
    expect(sorted([])).toEqual([]);
  });

  it("deja igual un array de un elemento", () => {
    expect(sorted([42])).toEqual([42]);
  });

  it("ordena un array de dos elementos", () => {
    expect(sorted([2, 1])).toEqual([1, 2]);
  });

  it("mantiene un array ya ordenado", () => {
    expect(sorted([1, 2, 3, 4, 5])).toEqual([1, 2, 3, 4, 5]);
  });

  it("ordena un array en orden inverso", () => {
    expect(sorted([5, 4, 3, 2, 1])).toEqual([1, 2, 3, 4, 5]);
  });

  it("ordena con elementos repetidos y negativos", () => {
    expect(sorted([3, -1, 3, 0, -1, 2, 3])).toEqual([-1, -1, 0, 2, 3, 3, 3]);
  });

  it("deja igual un array con todos los elementos idénticos", () => {
    expect(sorted([7, 7, 7, 7])).toEqual([7, 7, 7, 7]);
  });

  it("ordena los valores extremos de Int32", () => {
    expect(sorted([0, 2147483647, -2147483648, -1, 1])).toEqual([
      -2147483648, -1, 0, 1, 2147483647,
    ]);
  });

  it("ordena in situ el mismo array", () => {
    const a = Int32Array.from([3, 1, 2]);
    selectionSort(a);
    expect(Array.from(a)).toEqual([1, 2, 3]);
  });

  it("ordena un array aleatorio grande igual que Array.prototype.sort", () => {
    const input = selectionsort.generateInput(10_000);
    const expected = Array.from(input).sort((x, y) => x - y);

    selectionsort.run(input);

    expect(Array.from(input)).toEqual(expected);
  });

  it("genera una entrada del tamaño pedido", () => {
    expect(selectionsort.generateInput(1000)).toHaveLength(1000);
  });

  it("está registrado con su nombre", () => {
    expect(selectionsort.name).toBe("selectionsort");
    expect(registry.get("selectionsort")).toBe(selectionsort);
  });
});
