import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    coverage: {
      provider: "v8",
      // Se mide todo src/, no solo los ficheros que importan los tests.
      include: ["src/**/*.ts"],
      // lcov es el formato que lee Codecov; text y html para verlo en local.
      reporter: ["text", "html", "lcov"],
    },
  },
});
