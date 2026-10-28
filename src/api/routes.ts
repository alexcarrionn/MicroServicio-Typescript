import type { FastifyInstance } from "fastify";
import { registry } from "../algorithms/registry.js";
import { runBenchmark } from "../benchmark/runner.js";
import { benchmarkRequestSchema } from "./schemas.js";

export async function routes(app: FastifyInstance): Promise<void> {
  app.get("/health", async () => ({ status: "UP" }));

  app.get("/api/v1/algorithms", async () => ({
    algorithms: [...registry.keys()],
  }));

  app.post("/api/v1/benchmark", async (request) => {
    const { algorithm, size } = benchmarkRequestSchema.parse(request.body);
    const { timeMs, runs } = await runBenchmark({ algorithm, size });
    return { language: "typescript", algorithm, size, timeMs, runs };
  });
}
