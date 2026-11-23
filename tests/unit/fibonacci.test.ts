import { describe, expect, it } from "vitest";
import { fib, fibonacci } from "../../src/algorithms/fibonacci.js";
import { registry } from "../../src/algorithms/registry.js";

describe("fib", () => {
  it.each([
    { n: 0, expected: 0n },
    { n: 1, expected: 1n },
    { n: 2, expected: 1n },
    { n: 10, expected: 55n },
    { n: 50, expected: 12586269025n },
    { n: 100, expected: 354224848179261915075n },
  ])("calcula F($n) como bigint exacto", ({ n, expected }) => {
    expect(fib(n)).toBe(expected);
  });

  it.each([2, 3, 10, 50, 79, 100, 200])(
    "cumple la relación de recurrencia para n = %i",
    (n) => {
      expect(fib(n)).toBe(fib(n - 1) + fib(n - 2));
    },
  );

  it.each([-1, -10, 0.5, 1.5, -1.5, NaN, Infinity, -Infinity])(
    "lanza RangeError si n es %s",
    (n) => {
      expect(() => fib(n)).toThrow(RangeError);
    },
  );
});

describe("fibonacci", () => {
  it.each([0, 1, 10_000, 1_000_000])(
    "genera el índice %i sin modificarlo y de forma determinista",
    (size) => {
      expect(fibonacci.generateInput(size)).toBe(size);
      expect(fibonacci.generateInput(size)).toBe(size);
    },
  );

  it("está registrado con su nombre canónico", () => {
    expect(fibonacci.name).toBe("fibonacci");
    expect(registry.get("fibonacci")).toBe(fibonacci);
  });

  it("ejecuta el algoritmo con el retorno void de la interfaz común", () => {
    expect(fibonacci.run(100)).toBeUndefined();
  });

  it.each([-1, 1.5])("propaga la validación de fib para n = %s", (n) => {
    expect(() => fibonacci.run(n)).toThrow(RangeError);
  });
});
