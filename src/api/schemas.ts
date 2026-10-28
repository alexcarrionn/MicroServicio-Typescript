import { z } from "zod";
import { registry } from "../algorithms/registry.js";

export const benchmarkRequestSchema = z.object({
  algorithm: z.string().refine((name) => registry.has(name), {
    message: "Algoritmo desconocido. Consulta GET /api/v1/algorithms",
  }),
  size: z.number().int().positive(),
});

export type BenchmarkRequestBody = z.infer<typeof benchmarkRequestSchema>;
