import { performance } from "node:perf_hooks";
import type { Algorithm } from "../algorithms/types.js";

/** Número de ejecuciones medidas en cada benchmark. */
export const RUNS = 5;

/**
 * Mide `runs` ejecuciones de `algorithm` con entradas de tamaño `size` y
 * devuelve los tiempos en milisegundos.
 *
 * Antes hace una ejecución de calentamiento que no se cuenta, para que el JIT
 * de V8 ya haya optimizado el código. Cada entrada se genera fuera del
 * cronómetro.
 */
export function measure(
  algorithm: Algorithm,
  size: number,
  runs = RUNS,
): number[] {
  algorithm.run(algorithm.generateInput(size));

  const samples: number[] = [];
  for (let i = 0; i < runs; i++) {
    const input = algorithm.generateInput(size);
    const start = performance.now();
    algorithm.run(input);
    samples.push(performance.now() - start);
  }
  return samples;
}
