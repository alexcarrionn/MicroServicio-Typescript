/**
 * Contrato común de todos los algoritmos del microservicio.
 *
 * `TInput` es el tipo de la entrada que genera y consume cada algoritmo: un
 * `Int32Array` para los de ordenación, un número para Fibonacci, un par de
 * matrices para la multiplicación... Así cada algoritmo declara la suya sin
 * tener que tocar este fichero.
 */
export interface Algorithm<TInput = unknown> {
  /** Nombre canónico, en minúsculas. Es el valor que acepta el campo "algorithm". */
  readonly name: string;

  /** Genera una entrada de tamaño `size`. Se ejecuta FUERA del cronómetro. */
  generateInput(size: number): TInput;

  /** Ejecuta el algoritmo. Es lo único que se mide. */
  run(input: TInput): void;
}
