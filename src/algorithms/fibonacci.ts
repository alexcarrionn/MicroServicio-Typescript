import type { Algorithm } from "./types.js";

// Conserva el resultado entre ejecuciones para que el cálculo se consuma.
const resultSink = { value: 0n };

/** Fibonacci iterativo con dos acumuladores de precisión arbitraria. */
export const fibonacci: Algorithm<number> = {
  name: "fibonacci",

  generateInput(size: number) {
    return size;
  },

  run(input) {
    resultSink.value = fib(input);
  },
};

/** Calcula F(n) para un índice entero no negativo. */
export function fib(n: number): bigint {
  if (!Number.isInteger(n) || n < 0) {
    throw new RangeError(
      "El índice de Fibonacci debe ser un entero no negativo",
    );
  }

  let current = 0n;
  let next = 1n;
  for (let i = 0; i < n; i++) {
    const sum = current + next;
    current = next;
    next = sum;
  }
  return current;
}
