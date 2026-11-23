---
title: "Fibonacci"
---

# Fibonacci

## Resumen

Fibonacci calcula el término de índice `n` de la sucesión mediante programación
dinámica iterativa. Se incorpora al microservicio para comparar esta variante
entre lenguajes, utilizando enteros de precisión arbitraria para que también
puedan medirse índices grandes.

## Definición y comportamiento

La sucesión se define por `F(0) = 0`, `F(1) = 1` y
`F(n) = F(n - 1) + F(n - 2)` para `n >= 2`.

La función exportada `fib(n: number): bigint` devuelve el valor exacto de
`F(n)`. Por ejemplo, `fib(2)` devuelve `1n`, `fib(10)` devuelve `55n` y
`fib(100)` devuelve `354224848179261915075n`.

Se admite `n = 0`. Un índice negativo o no entero provoca un `RangeError`;
también se rechazan `NaN` y los infinitos. La función no modifica la entrada.

## Contrato en este servicio

- **Nombre canónico:** `fibonacci` (el valor de `algorithm` en la API).
- **Significado de `size`:** índice `n` del término que se calcula.
- **Entrada:** un `number` entero no negativo para la función `fib`.
  `generateInput(size)` devuelve el propio `size`, sin aleatoriedad.
- **Resultado:** `fib` calcula `F(n)` como `bigint`. El adaptador `run` conserva
  ese resultado internamente y devuelve `void`; la respuesta HTTP contiene
  las mediciones, no el término de Fibonacci.

La API solo admite tamaños enteros positivos, por lo que `size: 0` devuelve
un error de validación aunque `fib(0)` sea válido. La generación de la entrada
se hace fuera del cronómetro; únicamente se mide la ejecución del algoritmo.

## Estrategia y variante implementada

Se mantienen dos acumuladores `bigint` con términos consecutivos, inicialmente
`0n` y `1n`. En cada iteración se calcula su suma y se avanza al siguiente par.
Tras `n` iteraciones, el primer acumulador contiene `F(n)`.

Esta es una variante de programación dinámica que conserva solo los dos
valores necesarios para el siguiente paso. No utiliza recursión, un array de
memoización ni doblado rápido. La variante recursiva ingenua repetiría
subproblemas y tendría coste exponencial; el doblado rápido sería un algoritmo
distinto para comparar en otro issue.

`bigint` evita la pérdida de precisión que aparece con `number` a partir de
`F(79)` y el desbordamiento a `Infinity` en `F(1477)`. No se convierte el
resultado a `number` ni a texto durante la medición.

## Complejidad

| Caso | Tiempo | Memoria adicional |
|-------|--------|-------------------|
| Mejor | O(n) sumas; aproximadamente O(n²) operaciones de bit | O(1) variables; O(n) bits |
| Medio | O(n) sumas; aproximadamente O(n²) operaciones de bit | O(1) variables; O(n) bits |
| Peor | O(n) sumas; aproximadamente O(n²) operaciones de bit | O(1) variables; O(n) bits |

Para un mismo `n`, la entrada es determinista y se realiza el mismo número de
pasos: no hay una distinción entre mejor, medio y peor caso. Los casos base
tienen coste constante.

El bucle realiza O(n) sumas, pero una suma de `bigint` no tiene coste constante:
`F(n)` ocupa aproximadamente `0,694 · n` bits. Al sumar términos cada vez más
grandes, el coste acumulado es aproximadamente O(n²) operaciones de bit.

Se mantiene un número constante de variables y valores temporales. Sus
valores crecen hasta O(n) bits, así que O(1) variables no significa O(1) bytes.
El almacenamiento privado del último resultado también requiere O(n) bits.

## Correctitud y propiedades

Al inicio de la iteración de índice `i`, los acumuladores contienen `F(i)` y
`F(i + 1)`. Esto se cumple inicialmente para `i = 0`. La actualización los
sustituye por `F(i + 1)` y `F(i) + F(i + 1) = F(i + 2)`, conservando la
propiedad. Por inducción, al completar `n` iteraciones el primer acumulador
contiene `F(n)`. Para `n = 0` no se ejecuta el bucle y se devuelve `0n`.

El cálculo es determinista y no modifica la entrada, que es un valor numérico.
La aritmética `bigint` mantiene la exactitud de cada suma.

## Implementación en este servicio

- **Código:** [`src/algorithms/fibonacci.ts`](../src/algorithms/fibonacci.ts).
- **Registro:** `src/algorithms/registry.ts`.
- **Decisiones relevantes:** el adaptador implementa `Algorithm<number>` y
  conserva el resultado en un objeto privado del módulo para consumir el
  cálculo. No se añade el `bigint` a la respuesta JSON ni se modifica el
  contrato común de la API.

El motor existente ejecuta el benchmark en un `worker_thread`. Primero hace
un calentamiento y después cinco ejecuciones medidas con `performance.now()`.
En cada ejecución, `generateInput` queda fuera del intervalo medido. El
servicio devuelve la mediana en `timeMs` y `runs: 5`.

## Tests

Los tests unitarios están en
[`tests/unit/fibonacci.test.ts`](../tests/unit/fibonacci.test.ts) y cubren:

- `F(0) = 0n`, `F(1) = 1n` y `F(2) = 1n`.
- Los valores exactos `F(10) = 55n`, `F(50) = 12586269025n` y
  `F(100) = 354224848179261915075n`.
- La relación `F(n) = F(n - 1) + F(n - 2)` para varios índices.
- El `RangeError` con índices negativos, fraccionarios o no finitos.
- La entrada determinista, el adaptador y el registro con el nombre canónico.

Los tests de integración de
[`tests/integration/api.test.ts`](../tests/integration/api.test.ts) comprueban
que Fibonacci aparece en el listado, que su benchmark respeta la respuesta
común y que los tamaños inválidos siguen rechazándose.

```bash
npm test -- tests/unit/fibonacci.test.ts tests/integration/api.test.ts
```

## Benchmark

Con la API en marcha, se puede comprobar primero el registro:

```bash
curl http://localhost:3000/api/v1/algorithms
```

Estos comandos miden tres índices crecientes:

```bash
curl -X POST http://localhost:3000/api/v1/benchmark \
  -H "Content-Type: application/json" \
  -d '{"algorithm":"fibonacci","size":10000}'

curl -X POST http://localhost:3000/api/v1/benchmark \
  -H "Content-Type: application/json" \
  -d '{"algorithm":"fibonacci","size":100000}'

curl -X POST http://localhost:3000/api/v1/benchmark \
  -H "Content-Type: application/json" \
  -d '{"algorithm":"fibonacci","size":1000000}'
```

Cada respuesta corresponde a la mediana de cinco ejecuciones, tras un
calentamiento adicional. Al crecer `size`, aumenta tanto el número de sumas
como el tamaño de los enteros; por eso no debe esperarse un crecimiento
lineal del tiempo solo porque el bucle tenga O(n) iteraciones. El hardware,
V8 y la gestión de memoria también influyen en las mediciones.

Los tiempos dependen del entorno y no constituyen una garantía. Las salidas
reales de estos comandos se incluyen en el PR; si alguna ejecución falla por
límites o timeout, se conserva ese resultado sin modificar los límites para
forzar que pase.

## Fuentes y referencias

- [Issue #20 — Fibonacci](https://github.com/alexcarrionn/MicroServicio-Typescript/issues/20).
