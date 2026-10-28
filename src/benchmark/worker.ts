import { parentPort, workerData } from "node:worker_threads";
import { registry } from "../algorithms/registry.js";
import { measure } from "./measure.js";
import type { BenchmarkRequest } from "./runner.js";

const { algorithm, size } = workerData as BenchmarkRequest;

const selected = registry.get(algorithm);
if (!selected) {
  throw new Error(`Algoritmo desconocido: ${algorithm}`);
}

parentPort?.postMessage(measure(selected, size));
