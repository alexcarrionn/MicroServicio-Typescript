import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { buildApp } from "../../src/api/app.js";

const app = buildApp();

beforeAll(async () => {
  await app.ready();
});

afterAll(async () => {
  await app.close();
});

describe("GET /health", () => {
  it("responde que el servicio está levantado", async () => {
    const response = await request(app.server).get("/health");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: "UP" });
  });
});

describe("GET /api/v1/algorithms", () => {
  it("lista los algoritmos registrados", async () => {
    const response = await request(app.server).get("/api/v1/algorithms");

    expect(response.status).toBe(200);
    expect(response.body.algorithms).toContain("mergesort");
  });
});

describe("POST /api/v1/benchmark", () => {
  it("devuelve el resultado con el formato del contrato", async () => {
    const response = await request(app.server)
      .post("/api/v1/benchmark")
      .send({ algorithm: "mergesort", size: 1000 });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      language: "typescript",
      algorithm: "mergesort",
      size: 1000,
      timeMs: expect.any(Number),
      runs: 5,
    });
    expect(response.body.timeMs).toBeGreaterThanOrEqual(0);
  });

  it.each([
    ["cero", 0],
    ["negativo", -5],
    ["decimal", 1.5],
    ["texto", "1000"],
    ["null", null],
  ])("devuelve 400 si size es %s", async (_, size) => {
    const response = await request(app.server)
      .post("/api/v1/benchmark")
      .send({ algorithm: "mergesort", size });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("Bad Request");
    expect(response.body.message).toBe("Bad Request");
    expect(response.body.details).toContainEqual(
      expect.objectContaining({ path: "size" }),
    );
  });

  it("devuelve 400 si falta size", async () => {
    const response = await request(app.server)
      .post("/api/v1/benchmark")
      .send({ algorithm: "mergesort" });

    expect(response.status).toBe(400);
    expect(response.body.details).toContainEqual(
      expect.objectContaining({ path: "size" }),
    );
  });

  it("devuelve 400 si el algoritmo no existe", async () => {
    const response = await request(app.server)
      .post("/api/v1/benchmark")
      .send({ algorithm: "bogosort", size: 10 });

    expect(response.status).toBe(400);
    expect(response.body.details).toContainEqual(
      expect.objectContaining({ path: "algorithm" }),
    );
  });

  it("devuelve un error JSON si el cuerpo no es JSON válido", async () => {
    const response = await request(app.server)
      .post("/api/v1/benchmark")
      .set("Content-Type", "application/json")
      .send("{no es json");

    expect(response.status).toBe(400);
    expect(response.type).toBe("application/json");
    expect(response.body.error).toBe("Bad Request");
    expect(response.body.message).toBe("Bad Request");
  });
});
