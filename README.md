# MicroServicio-Typescript

[![CI](https://github.com/alexcarrionn/MicroServicio-Typescript/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/alexcarrionn/MicroServicio-Typescript/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/alexcarrionn/MicroServicio-Typescript/graph/badge.svg)](https://codecov.io/gh/alexcarrionn/MicroServicio-Typescript)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=TypeScript&logoColor=FFF)
![Node.js 22](https://img.shields.io/badge/Node.js-22-339933?logo=nodedotjs&logoColor=white)

Microservicio REST en **TypeScript** (Node.js 22, Fastify, Zod) que mide el tiempo de ejecución de algoritmos. Forma parte del proyecto global de comparación de rendimiento de algoritmos de la asignatura **Prácticas Continuas** del Máster en Ingeniería del Software de la Universidad de Murcia: cada grupo implementa la misma API en un lenguaje distinto y un frontend común las consulta para comparar los tiempos.

El algoritmo de referencia es **MergeSort**. El resto se añaden mediante issues que resuelven miembros de otros equipos (ver [Contribuir](#contribuir)).

## Requisitos

| Herramienta | Versión | Comprobación |
|-------------|---------|--------------|
| Git         | cualquiera reciente | `git --version` |
| Node.js     | **22 LTS** | `node -v` |
| npm         | 10+ | `npm -v` |
| Docker (con Compose) | cualquiera reciente, opcional | `docker compose version` |

Con `nvm`, basta con ejecutar `nvm use` en la raíz: el fichero `.nvmrc` fija la versión de Node.

## Puesta en marcha en local

### 1. Clonar el repositorio

```bash
git clone https://github.com/alexcarrionn/MicroServicio-Typescript.git
cd MicroServicio-Typescript
```

### 2. Instalar dependencias

```bash
npm ci
```

`npm ci` instala exactamente las versiones de `package-lock.json`, igual que la CI.

### 3. Activar los hooks de Git

El repositorio versiona sus hooks en `.githooks/`. Git no los usa por defecto, así que **cada persona que clone el repositorio debe ejecutar esto una vez**:

```bash
git config core.hooksPath .githooks
chmod +x .githooks/pre-commit   # solo en Linux/macOS
```

El hook `pre-commit` pasa Prettier y ESLint sobre los ficheros en *staging* antes de cada commit.

### 4. Arrancar

```bash
npm run dev     # modo desarrollo, con recarga automática
```

O compilado, como se ejecuta en producción:

```bash
npm run build   # compila TypeScript a dist/
npm start
```

La API queda escuchando en **`http://localhost:3000`**.

### 5. Comprobar que funciona

```bash
curl http://localhost:3000/health
# {"status":"UP"}
```

## Uso de la API

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET    | `/health`            | Estado del servicio |
| GET    | `/api/v1/algorithms` | Lista los algoritmos disponibles |
| POST   | `/api/v1/benchmark`  | Ejecuta un algoritmo y devuelve el tiempo medido |

### Ejecutar un benchmark

```bash
curl -X POST http://localhost:3000/api/v1/benchmark \
  -H "Content-Type: application/json" \
  -d '{"algorithm":"mergesort","size":10000}'
```

```json
{
  "language": "typescript",
  "algorithm": "mergesort",
  "size": 10000,
  "timeMs": 12.34,
  "runs": 5
}
```

- `algorithm`: nombre del algoritmo, tal y como aparece en `GET /api/v1/algorithms`.
- `size`: tamaño de la entrada; tiene que ser un entero positivo. Si no lo es, se devuelve `400` con un JSON de error.
- `timeMs`: **mediana** de 5 ejecuciones, en milisegundos. Antes se hace una ejecución de calentamiento que no cuenta, y la entrada se genera fuera del cronómetro.

El contrato es común a todos los lenguajes del proyecto y no se cambia sin acordarlo entre todos los grupos. Los detalles del protocolo de medición están en [CONTRIBUTING.md](.github/CONTRIBUTING.md#53-protocolo-de-medición).

## Tests y calidad

```bash
npm test                # unitarios e integración
npm run test:coverage   # con informe de cobertura en coverage/
npm run lint            # ESLint
npm run format:check    # Prettier, sin modificar ficheros
```

## Despliegue

### Con Docker Compose

```bash
docker compose up -d --build
docker compose ps
```

La API se publica en `http://localhost:3000`. Para pararla, `docker compose down`.


## CI/CD

Los workflows están en `.github/workflows/`:

| Workflow | Cuándo se ejecuta | Qué hace |
|----------|-------------------|----------|
| `ci.yml`      | Push a `main` y cada PR | `lint` (Prettier y ESLint) → `test` (tests con cobertura) → `build` (compila y sube `dist/` como artefacto) |
| `release.yml` | Push a `main` y tags `v*.*.*` | Construye la imagen Docker y la publica en GHCR con las etiquetas de la tabla anterior |
| `pages.yml`   | Push a `main` o a mano | Genera la documentación y la publica en GitHub Pages |
| `ai-summary.yml` | Cada PR abierto desde una rama del repo | Pide a una IA (GitHub Models) un resumen del cambio y lo publica como comentario en el PR |

Un PR solo se puede fusionar si los tres jobs de `ci.yml` están en verde.

### Publicar una versión

Las versiones siguen [SemVer](https://semver.org/lang/es/). Para publicar una, se etiqueta un commit de `main`:

```bash
git switch main
git pull
git tag v1.0.0
git push origin v1.0.0
```

`release.yml` publica entonces la imagen con las etiquetas `1.0.0`, `1.0` y `1`.

## Estructura del proyecto

```
.
├── .github/
│   ├── ISSUE_TEMPLATE/        # plantillas de issues
│   ├── workflows/             # CI, publicación y GitHub Pages
│   ├── CONTRIBUTING.md
│   └── PULL_REQUEST_TEMPLATE.md
├── docs/
│   ├── mergesort.md          # documentación del algoritmo de referencia
│   └── plantilla-algoritmo.md
├── src/
│   ├── algorithms/           # algoritmos y registro
│   ├── api/                  # rutas y validación HTTP
│   └── benchmark/            # entradas, medición y workers
├── tests/
│   ├── unit/
│   └── integration/
└── .githooks/                # hooks locales versionados
```

## Contribuir

Las contribuciones entran siempre por Pull Request: la rama `main` está protegida, cada PR necesita la aprobación de un miembro del equipo y que pase la CI.

Si vienes de otro equipo para implementar un algoritmo, busca un issue con la etiqueta `good first issue` y sigue la guía de [CONTRIBUTING.md](.github/CONTRIBUTING.md#6-cómo-añadir-un-algoritmo).

Cada algoritmo nuevo debe incluir su documentación en `docs/<nombre>.md`, creada a partir de la [plantilla de documentación](docs/plantilla-algoritmo.md). Espera a que te asignen el issue antes de empezar.

Los commits siguen [Conventional Commits](https://www.conventionalcommits.org/es/): `tipo(ámbito): descripción en imperativo`.

## Equipo

- [@alexcarrionn](https://github.com/alexcarrionn)
- [@hsanchezm7](https://github.com/hsanchezm7)
- [@glooriasanchezzz](https://github.com/glooriasanchezzz)
- [@samuelavilesc](https://github.com/samuelavilesc)

## Licencia

Distribuido bajo la licencia incluida en [LICENSE](LICENSE).
