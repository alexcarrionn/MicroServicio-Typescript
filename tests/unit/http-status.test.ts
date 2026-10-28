import { describe, expect, it } from "vitest";
import { httpStatusName } from "../../src/api/http-status.js";

describe("httpStatusName", () => {
  it.each([
    [400, "Bad Request"],
    [404, "Not Found"],
    [500, "Internal Server Error"],
  ])("devuelve el nombre estándar para el estado HTTP %i", (status, name) => {
    expect(httpStatusName(status)).toBe(name);
  });

  it("devuelve un nombre genérico para un estado desconocido", () => {
    expect(httpStatusName(599)).toBe("Error");
  });
});
