import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  output: "static",
  site: "https://tracevisor.com",
  i18n: {
    defaultLocale: "en",
    locales: ["en", "es", "fr", "pt", "de"],
    routing: { prefixDefaultLocale: true },
  },
  integrations: [sitemap()],
  vite: { plugins: [tailwindcss()] },
});
