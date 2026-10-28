import { describe, expect, it, vi } from "vitest";
import type { Algorithm } from "../../src/algorithms/types.js";
import { measure, RUNS } from "../../src/benchmark/measure.js";

function fakeAlgorithm(): Algorithm {
  return {
    name: "fake",
    generateInput: vi.fn((size: number) => new Int32Array(size)),
    run: vi.fn(),
  };
}

describe("measure", () => {
  it("hace un calentamiento y luego las ejecuciones medidas", () => {
    const algorithm = fakeAlgorithm();

    const samples = measure(algorithm, 10);

    expect(samples).toHaveLength(RUNS);
    expect(algorithm.run).toHaveBeenCalledTimes(RUNS + 1);
  });

  it("genera una entrada nueva del tamaño pedido en cada ejecución", () => {
    const algorithm = fakeAlgorithm();

    measure(algorithm, 10, 3);

    expect(algorithm.generateInput).toHaveBeenCalledTimes(4);
    expect(algorithm.generateInput).toHaveBeenCalledWith(10);
  });

  it("devuelve tiempos no negativos", () => {
    for (const sample of measure(fakeAlgorithm(), 10)) {
      expect(sample).toBeGreaterThanOrEqual(0);
    }
  });
});
