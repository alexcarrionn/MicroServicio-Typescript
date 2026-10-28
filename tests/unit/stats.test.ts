import { describe, expect, it } from "vitest";
import { median } from "../../src/benchmark/stats.js";

describe("median", () => {
  it("devuelve el valor central con un número impar de muestras", () => {
    expect(median([5, 1, 3, 2, 4])).toBe(3);
  });

  it("devuelve la media de los dos centrales con un número par de muestras", () => {
    expect(median([4, 1, 3, 2])).toBe(2.5);
  });

  it("no se deja arrastrar por un pico aislado", () => {
    expect(median([10, 11, 12, 13, 1000])).toBe(12);
  });

  it("no modifica la lista original", () => {
    const samples = [3, 1, 2];
    median(samples);
    expect(samples).toEqual([3, 1, 2]);
  });

  it("falla con una lista vacía", () => {
    expect(() => median([])).toThrow(RangeError);
  });
});
