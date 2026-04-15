import { defineConfig } from "vitest/config";
import { fileURLToPath } from "url";
import { resolve } from "path";

export default defineConfig({
  resolve: {
    alias: {
      "@": resolve(fileURLToPath(new URL(".", import.meta.url))),
    },
  },
  test: {
    environment: "node",
    include: ["tests/**/*.test.ts"],
  },
});
