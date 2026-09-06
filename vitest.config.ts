import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";
export default defineConfig({
  resolve: { alias: { "@": fileURLToPath(new URL(".", import.meta.url)) } },
  test: {
    maxWorkers: 2,
    testTimeout: 15000,
    environment: "jsdom",
    setupFiles: ["./tests/setup.ts"],
  },
});
