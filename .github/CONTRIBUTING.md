# Guía de Contribución

¡Gracias por querer colaborar en este microservicio! Forma parte del **proyecto global de comparación de rendimiento de algoritmos**: cada grupo mantiene una REST API en un lenguaje distinto, todas con el mismo contrato, y un frontend común las consulta para comparar tiempos de ejecución. Este repositorio es la implementación en **TypeScript**.

Si vienes de otro equipo a resolver uno de nuestros issues, lo que te interesa está en la sección [6. Cómo añadir un algoritmo](#6-cómo-añadir-un-algoritmo).

---

## 1. Requisitos del entorno

| Herramienta | Versión requerida | Comprobación |
|-------------|-------------------|--------------|
| **Git**     | Versión reciente  | `git --version` |
| **Node.js** | **22 LTS**        | `node -v` |
| **npm**     | 10+               | `npm -v` |
| **Docker**  | Cualquiera reciente (opcional) | `docker compose version` |

> Si usas `nvm`, basta con `nvm use` en la raíz del repositorio: el fichero `.nvmrc` fija la versión.

Instalación de dependencias y primer arranque:

```bash
npm ci              # instala exactamente lo que fija package-lock.json
npm run dev         # arranca en modo desarrollo con recarga automática
```

La API queda escuchando en `http://localhost:3000`. Comprueba que responde:

```bash
curl http://localhost:3000/health
# {"status":"UP"}
```

También puedes levantarlo en contenedor, que es como se ejecuta en producción:

```bash
docker compose up --build
```

---

## 2. Configuración inicial del repositorio

Tras clonar, es **obligatorio activar los hooks de Git versionados**. Garantizan que ningún commit entre sin formatear y sin pasar el linter:

```bash
# 1. Configurar la ruta de hooks versionados
git config core.hooksPath .githooks

# 2. Asignar permisos de ejecución (Linux/macOS)
chmod +x .githooks/pre-commit
```

> Los hooks viven normalmente en `.git/hooks/`, que **no se versiona**. Por eso los guardamos en `.githooks/` y apuntamos `core.hooksPath` ahí. Aun así, cada persona que clone debe ejecutar ese `git config` **una vez**.

### ¿Qué hace el hook `pre-commit`?

Ejecuta **Prettier** y **ESLint** con autocorrección sobre los ficheros en *staging* y los vuelve a indexar. Si queda algún error de lint que no se puede corregir solo, el commit se cancela.

Puedes lanzar lo mismo a mano en cualquier momento:

```bash
npm run format      # prettier --write
npm run lint        # eslint
npm run lint:fix    # eslint --fix
```

El hook local **no sustituye a la CI**: siempre se puede saltar con `git commit --no-verify`, y por eso el pipeline vuelve a comprobarlo.

---

## 3. Uso de Inteligencia Artificial (IA)

El uso de herramientas de asistencia basada en IA (ChatGPT, GitHub Copilot, Gemini, Claude, etc.) está permitido como apoyo al desarrollo, pero **su uso debe ser transparente y responsable**:

1. **Declaración obligatoria.** Si has utilizado IA para generar código, diseñar tests, redactar documentación o resolver incidencias, **debes declararlo en la descripción del Pull Request**, indicando la herramienta y el alcance de su intervención.
2. **Responsabilidad humana.** Quien envía el PR es responsable al 100 % del código aportado. Debes comprender cada línea generada, verificar que no introduce vulnerabilidades, malas prácticas ni dependencias innecesarias, y asegurar que cumple los estándares del proyecto.
3. **Validación estricta.** El código asistido por IA pasa exactamente las mismas pruebas y revisiones que el escrito a mano.

> Aviso específico de este proyecto: los algoritmos generados por IA **suelen venir con una complejidad distinta de la pedida**. Un "QuickSort" que crea tres arrays nuevos en cada partición no es el QuickSort que queremos medir. Lee lo que te genere antes de abrir el PR.

---

## 4. Flujo de trabajo con Git y GitHub

### 4.1. Reportar problemas o sugerencias (Issues)

Antes de empezar cualquier tarea de cierto alcance, abre o busca una Issue. Al crear una nueva, usa las plantillas disponibles en `.github/ISSUE_TEMPLATE/`:

* **Bug report** — para fallos de funcionamiento o regresiones.
* **Enhancement** — para nuevas características o mejoras técnicas.
* **Nuevo algoritmo** — plantilla específica para implementar uno de los algoritmos pendientes.

Si vienes de otro equipo, **comenta en el issue antes de ponerte**, para que no lo cojan dos personas a la vez. Te lo asignamos y es tuyo.

### 4.2. Ramas de trabajo

Crea ramas descriptivas a partir de `main`:

* `feat/nombre-funcionalidad` — p. ej. `feat/quicksort`
* `fix/descripcion-del-bug`
* `refactor/nombre-mejora`
* `docs/nombre`

Si **no tienes permisos de escritura** en este repositorio (caso habitual si eres de otro grupo), haz un **fork** y abre el PR desde tu fork.

### 4.3. Convención de commits

Seguimos [Conventional Commits](https://www.conventionalcommits.org/):

```
tipo(ámbito): descripción clara en imperativo
```

* **Tipos permitidos:** `feat`, `fix`, `docs`, `test`, `refactor`, `build`, `chore`, `ci`.
* **Ejemplos:**
  * `feat(algorithms): añade quicksort con partición de Lomuto`
  * `fix(api): devuelve 400 cuando size no es un entero positivo`
  * `test(benchmark): cubre el cálculo de la mediana con muestras pares`
  * `ci(release): publica la imagen en GHCR con etiquetas SemVer`

Los commits deben estar **firmados con el nombre de quien los realiza**. No se aceptan commits cuyo autor sea una herramienta de IA.

---

## 5. Estándares de desarrollo y pruebas

### 5.1. Arquitectura

Respeta la separación de responsabilidades:

```
src/
├── algorithms/     # implementaciones puras, sin dependencias de HTTP
├── benchmark/      # generación de entradas, ejecución y cálculo de la mediana
└── api/            # rutas, validación y manejo de errores
```

Reglas que no se negocian:

* **Los algoritmos no conocen HTTP.** Un fichero de `algorithms/` no importa nada de `api/` ni de Fastify. Son funciones puras sobre datos.
* **La validación de entrada vive en `api/schemas.ts`**, con Zod. Los algoritmos pueden dar por hecho que reciben datos válidos.
* **Los errores se canalizan por el manejador centralizado** y siempre salen como JSON, nunca como una traza de excepción.
* **TypeScript en modo `strict`.** Nada de `any`: si necesitas una vía de escape, usa `unknown` y estrecha el tipo.

### 5.2. El contrato de la API

Este microservicio forma parte de un sistema con varios lenguajes y **todos comparten el mismo contrato**. Está documentado en [`CONTRACT.md`](CONTRACT.md) y **no se modifica por iniciativa de un PR**: cualquier cambio tiene que acordarse antes entre todos los grupos.

```jsonc
// POST /api/v1/benchmark
{ "algorithm": "mergesort", "size": 10000 }

// 200 OK
{
  "language": "typescript",
  "algorithm": "mergesort",
  "size": 10000,
  "timeMs": 12.34,   // mediana de las 5 mediciones
  "runs": 5
}
```

Un PR que cambie los nombres de los campos, los códigos de estado o el significado de `size` será rechazado aunque funcione: rompería al frontend y a la comparación con los demás lenguajes.

### 5.3. Protocolo de medición

Esto es lo que hace que los números signifiquen algo. Si tu PR toca el motor de medición, respétalo:

* **5 ejecuciones y se toma la mediana.** No la media: un pico aislado del recolector de basura no debe arrastrar el resultado.
* **La entrada se genera fuera del cronómetro.** Solo se mide el algoritmo, nunca la creación del array de prueba.
* **Se mide con `performance.now()`** de `node:perf_hooks`, no con `Date.now()`.
* **Hay una ejecución de calentamiento previa que no cuenta**, porque la primera pasada del JIT de V8 es mucho más lenta y falsearía la comparación.
* **El benchmark se ejecuta en un `worker_thread`**, no en el hilo principal. Node es monohilo: un ordenamiento de millones de elementos en el handler bloquearía el event loop y dejaría el servicio sin responder al healthcheck.

### 5.4. Pruebas

Toda contribución de código llega con tests. Sin excepciones.

| Tipo | Dónde | Qué comprueba |
|---|---|---|
| **Unitarios** | `tests/unit/` | Los algoritmos y el cálculo de la mediana, de forma aislada. |
| **Integración** | `tests/integration/` | Que los endpoints responden lo que dice el contrato, con Supertest. |

```bash
npm test                # ejecuta toda la batería
npm run test:watch      # modo interactivo mientras desarrollas
npm run test:coverage   # informe de cobertura
```

Ejecútalos **antes** de abrir el PR. La CI los volverá a ejecutar, pero descubrirlo en local es más rápido.

---

## 6. Cómo añadir un algoritmo

Es la contribución más habitual y la que piden la mayoría de nuestros issues. Está diseñada para que sea **añadir un fichero y registrarlo**, sin tocar nada más.

### Paso 1 — Coge el issue

Busca uno con la etiqueta `good first issue` o `help wanted`, comenta que lo coges y espera a que te lo asignen. El issue indica qué significa `size` para ese algoritmo y qué complejidad se espera.

### Paso 2 — Crea el fichero

Crea `src/algorithms/<nombre>.ts`. La interfaz común está en `src/algorithms/types.ts`:

```ts
export interface Algorithm {
  /** Nombre canónico, en minúsculas. Es el valor que acepta el campo "algorithm". */
  readonly name: string;

  /** Genera una entrada de tamaño `size`. Se ejecuta FUERA del cronómetro. */
  generateInput(size: number): AlgorithmInput;

  /** Ejecuta el algoritmo. Es lo único que se mide. */
  run(input: AlgorithmInput): void;
}
```

Ejemplo, tomando `mergesort.ts` como referencia:

```ts
import type { Algorithm } from './types.js';
import { randomInt32Array } from '../benchmark/input.js';

export const quicksort: Algorithm = {
  name: 'quicksort',

  generateInput(size: number) {
    return randomInt32Array(size);
  },

  run(input) {
    sort(input as Int32Array, 0, input.length - 1);
  },
};

function sort(a: Int32Array, lo: number, hi: number): void {
  // ...
}
```

Dos cosas importantes:

* **Usa el generador de entradas que ya existe** (`randomInt32Array`), no escribas uno nuevo. Si todos los algoritmos de ordenación no reciben el mismo tipo de entrada, los tiempos dejan de ser comparables.
* **Ordena in situ sobre el `Int32Array`.** Crear arrays nuevos en cada partición mide el recolector de basura, no el algoritmo.

### Paso 3 — Regístralo

Añade una línea en `src/algorithms/registry.ts`:

```ts
import { quicksort } from './quicksort.js';

export const registry = new Map<string, Algorithm>([
  [mergesort.name, mergesort],
  [quicksort.name, quicksort],   // ← tu línea
]);
```

Con eso el algoritmo queda disponible en `POST /api/v1/benchmark` y aparece automáticamente en `GET /api/v1/algorithms`. No hay que tocar las rutas ni la validación.

### Paso 4 — Escribe los tests

Crea `tests/unit/<nombre>.test.ts`. Como mínimo:

* Array vacío.
* Un solo elemento.
* Ya ordenado.
* Orden inverso.
* Con elementos repetidos.
* Un array aleatorio grande, comparando el resultado contra `Array.prototype.sort` como oráculo.

```bash
npm test
```

### Paso 5 — Pruébalo de verdad

```bash
npm run dev

curl -X POST http://localhost:3000/api/v1/benchmark \
  -H "Content-Type: application/json" \
  -d '{"algorithm":"quicksort","size":100000}'
```

Comprueba que `timeMs` tiene un valor razonable y que crece como esperas al aumentar `size`. Si un algoritmo `O(n log n)` tarda lo mismo con 1.000 que con 1.000.000 de elementos, algo no se está ejecutando.

### Paso 6 — Abre el PR

Sigue la sección 7. En las notas para quien revise, incluye la salida del `curl` con dos o tres tamaños distintos: nos ahorra tener que reproducirlo.

---

## 7. Envío y revisión de Pull Requests

### 7.1. Qué incluir

Completa todos los campos de la plantilla (`.github/PULL_REQUEST_TEMPLATE.md`):

* **Enlace a la Issue** correspondiente (`Closes #123`).
* **Resumen del cambio.**
* **Cómo lo has probado**: tests nuevos o actualizados, y comprobación manual con `curl`.
* **Declaración de uso de IA**, si la ha habido.
* **Notas para quien revise**: decisiones discutibles, alternativas descartadas, dudas.

### 7.2. Revisión

GitHub solicitará automáticamente la revisión de los propietarios definidos en `.github/CODEOWNERS`. **La aprobación tiene que venir de alguien del equipo propietario de este repositorio**, aunque tu PR venga de otro grupo.

Si te piden cambios, súbelos como commits nuevos **a la misma rama**: el PR se actualiza solo y la CI se vuelve a ejecutar. No cierres el PR para abrir otro.

### 7.3. Criterios de aceptación

Un PR se fusiona cuando se cumple **todo** esto:

| Criterio | Cómo se comprueba |
|---|---|
| El pipeline de CI está en verde | Checks `lint`, `test` y `build` |
| El código cumple el estilo | `npm run lint` y `npm run format:check` |
| La batería de tests pasa | `npm test` |
| Hay tests que cubren el cambio | Revisión manual |
| Al menos una aprobación de un *code owner* | Revisión en GitHub |
| No quedan conversaciones sin resolver | Revisión en GitHub |
| La rama está actualizada respecto a `main` | GitHub lo exige antes de fusionar |

### 7.4. Política de fusión

* **La rama `main` está protegida.** No se puede hacer push directo: todo entra por Pull Request. La regla se aplica también a quienes administran el repositorio.
* **Estrategia: _Squash and merge_.** Todo el PR entra en `main` como **un único commit**, cuyo mensaje debe seguir Conventional Commits. Mantiene el historial de `main` legible y evita que se cuelen commits intermedios del tipo "arreglo" o "ahora sí".
* **Quien fusiona es el equipo propietario**, no quien abre el PR.
* **La rama se borra tras la fusión.**
* Si `main` ha avanzado y tu rama se queda atrás, actualízala con **rebase** y sube con `git push --force-with-lease`:

  ```bash
  git fetch origin
  git rebase origin/main
  # resolver conflictos si los hay
  git push --force-with-lease
  ```

  Usa `--force-with-lease` y no `--force`: aborta el push si alguien ha subido algo a tu rama mientras tanto, en lugar de pisarlo.

---

## 8. Dónde preguntar

* **Dudas sobre el contrato o la integración con el frontend:** abre una discusión en el repositorio del frontend, porque afecta a todos los grupos.
* **Dudas sobre este microservicio:** comenta en el issue correspondiente, o abre uno nuevo si no existe.

Gracias por contribuir.