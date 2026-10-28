/**
 * Mediana de una lista de números. Con un número par de muestras devuelve la
 * media de las dos centrales.
 */
export function median(samples: readonly number[]): number {
  if (samples.length === 0) {
    throw new RangeError("No se puede calcular la mediana de una lista vacía");
  }
  const sorted = [...samples].sort((a, b) => a - b);
  const mid = sorted.length >> 1;
  return sorted.length % 2 === 0
    ? (sorted[mid - 1] + sorted[mid]) / 2
    : sorted[mid];
}
