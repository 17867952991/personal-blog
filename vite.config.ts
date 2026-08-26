import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";
import type { Plugin } from "vite";
import fs from "node:fs";
import path from "node:path";

// 生产构建时剔除视频文件（体积过大，仅本地保留用于预览，不进入部署产物）
function excludeVideosFromBuild(): Plugin {
  let outDir = "dist";
  return {
    name: "exclude-videos-from-build",
    configResolved(config) {
      outDir = config.build.outDir;
    },
    closeBundle() {
      const root = path.resolve(outDir);
      if (!fs.existsSync(root)) return;
      const walk = (dir: string) => {
        for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
          const full = path.join(dir, entry.name);
          if (entry.isDirectory()) walk(full);
          else if (entry.name.endsWith(".mp4")) fs.rmSync(full);
        }
      };
      walk(root);
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), excludeVideosFromBuild()],
  test: {
    environment: "jsdom",
    setupFiles: "./src/test/setup.ts",
    globals: true
  }
});
