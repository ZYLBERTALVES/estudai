import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  // Caminhos relativos permitem abrir o site dentro da pasta do repositório no Pages.
  base: "./",
  plugins: [react()],
});
