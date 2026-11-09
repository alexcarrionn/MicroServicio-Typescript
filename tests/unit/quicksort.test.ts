import { describe, expect, it } from "vitest";
import { registry } from "../../src/algorithms/registry.js";
import { quickSort, quicksort } from "../../src/algorithms/quicksort.js";

function sorted(values: number[]): number[] {
  const a = Int32Array.from(values);
  quickSort(a);
  return Array.from(a);
}

describe("quicksort", () => {
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
    quickSort(a);
    expect(Array.from(a)).toEqual([1, 2, 3]);
  });

  it("ordena entradas grandes ya ordenadas e inversas sin desbordar la pila", () => {
    const n = 100_000;
    const expected = Array.from({ length: n }, (_, i) => i);

    const asc = Int32Array.from(expected);
    quickSort(asc);
    expect(Array.from(asc)).toEqual(expected);

    const desc = Int32Array.from(expected).reverse();
    quickSort(desc);
    expect(Array.from(desc)).toEqual(expected);
  });

  it("ordena un array aleatorio grande igual que Array.prototype.sort", () => {
    const input = quicksort.generateInput(100_000);
    const expected = Array.from(input).sort((x, y) => x - y);

    quicksort.run(input);

    expect(Array.from(input)).toEqual(expected);
  });

  it("genera una entrada del tamaño pedido", () => {
    expect(quicksort.generateInput(1000)).toHaveLength(1000);
  });

  it("está registrado con su nombre", () => {
    expect(quicksort.name).toBe("quicksort");
    expect(registry.get("quicksort")).toBe(quicksort);
  });
});
