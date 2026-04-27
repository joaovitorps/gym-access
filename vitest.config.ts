import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    dir: "src",
    projects: [
      {
        extends: true,
        test: {
          name: "unit",
          dir: "src/use-cases",
        },
      },
      {
        extends: true,
        test: {
          name: "e2e",
          dir: "src/http/controllers",
          environment: "./prisma/test-environment/prisma-test-environment.ts",
        },
      },
    ],
  },
});
