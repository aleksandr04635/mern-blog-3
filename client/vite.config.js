import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";

//const url = import.meta.env.VITE_URL;
//const url2 = import.meta.env.VITE_API_BASE_URL;
//console.log("url", url);
// https://vitejs.dev/config/  //about .env
/* export default defineConfig({
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
}); */

export default defineConfig(({ command, mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), "");
  return {
    // vite config
    define: {
      __APP_ENV__: JSON.stringify(env.APP_ENV), //useless here?
      // __APP_URL__: JSON.stringify(env.VITE_URL),
    },
    server: {
      proxy: {
        "/api": {
          //target: "http://localhost:3000",
          target: env.VITE_SERVER_URL,
          secure: false,
        },
      },
    },
    plugins: [react()],
  };
});
