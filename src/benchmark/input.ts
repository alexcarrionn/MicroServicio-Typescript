/**
 * Genera un `Int32Array` de `size` enteros aleatorios en todo el rango de 32 bits.
 *
 * Es el generador común de todos los algoritmos de ordenación, para que los
 * tiempos sean comparables entre ellos.
 */
export function randomInt32Array(size: number): Int32Array {
  const array = new Int32Array(size);
  for (let i = 0; i < size; i++) {
    array[i] = (Math.random() * 0x1_0000_0000) | 0;
  }
  return array;
}
