import { describe, expect, it } from "vitest";
import { mergeSort, mergesort } from "../../src/algorithms/mergesort.js";
import { registry } from "../../src/algorithms/registry.js";

function sorted(values: number[]): number[] {
  const a = Int32Array.from(values);
  mergeSort(a);
  return Array.from(a);
}

describe("mergesort", () => {
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

  it("ordena con elementos repetidos y negativos", () => {
    expect(sorted([3, -1, 3, 0, -1, 2, 3])).toEqual([-1, -1, 0, 2, 3, 3, 3]);
  });

  it("ordena un array aleatorio grande igual que Array.prototype.sort", () => {
    const input = mergesort.generateInput(100_000);
    const expected = Array.from(input).sort((x, y) => x - y);

    mergesort.run(input);

    expect(Array.from(input)).toEqual(expected);
  });

  it("genera una entrada del tamaño pedido", () => {
    expect(mergesort.generateInput(1000)).toHaveLength(1000);
  });

  it("está registrado con su nombre", () => {
    expect(registry.get("mergesort")).toBe(mergesort);
  });
});
