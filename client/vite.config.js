import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

//const url = import.meta.env.VITE_URL;
//const url2 = import.meta.env.VITE_API_BASE_URL;
//console.log("url", url);
// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        //target: url,
        secure: false,
      },
    },
  },
  plugins: [react()],
});
