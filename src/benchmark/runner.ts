import { Worker } from "node:worker_threads";
import { RUNS } from "./measure.js";
import { median } from "./stats.js";

export interface BenchmarkRequest {
  algorithm: string;
  size: number;
}

export interface BenchmarkResult {
  /** Mediana de las ejecuciones medidas, en milisegundos. */
  timeMs: number;
  runs: number;
}

/**
 * Ejecuta el benchmark en un `worker_thread`, para que un algoritmo lento no
 * bloquee el event loop ni deje sin respuesta al healthcheck.
 */
export function runBenchmark(
  request: BenchmarkRequest,
): Promise<BenchmarkResult> {
  return new Promise((resolve, reject) => {
    const worker = createWorker(request);
    worker.once("message", (samples: number[]) => {
      resolve({ timeMs: median(samples), runs: RUNS });
    });
    worker.once("error", reject);
    worker.once("exit", (code) => {
      if (code !== 0) {
        reject(new Error(`El worker del benchmark terminó con código ${code}`));
      }
    });
  });
}

/**
 * Compilado, el worker es `worker.js` y se carga sin más. Desde el código
 * fuente (`npm run dev` y los tests) es `worker.ts`, y Node 22 no lo entiende:
 * hay que registrar tsx dentro del propio worker antes de importarlo.
 */
function createWorker(request: BenchmarkRequest): Worker {
  if (!import.meta.url.endsWith(".ts")) {
    return new Worker(new URL("./worker.js", import.meta.url), {
      workerData: request,
    });
  }

  const tsx = import.meta.resolve("tsx/esm/api");
  const worker = new URL("./worker.ts", import.meta.url).href;
  const bootstrap = `import(${JSON.stringify(tsx)}).then((m) => { m.register(); return import(${JSON.stringify(worker)}); });`;
  return new Worker(bootstrap, { eval: true, workerData: request });
}
