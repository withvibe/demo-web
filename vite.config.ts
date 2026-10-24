import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Dev server runs inside a WithVibe env and is reached over HTTPS via Traefik
// at https://dashboard-<short>.app.withvibe.dev. Vite blocks unknown Host
// headers by default and its HMR socket must dial back over 443/wss.
export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0",
    port: 8081,
    allowedHosts: [".withvibe.dev", ".localhost", "localhost"],
    hmr: { clientPort: 443 },
  },
});
