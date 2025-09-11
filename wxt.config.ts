import { defineConfig } from "wxt";

export default defineConfig({
  manifest: {
    name: "YouTube Live Chat Collapsed by Default",
    permissions: ["storage"],
    web_accessible_resources: [
      {
        resources: ["injected.js"],
        matches: ["https://www.youtube.com/*"],
      },
    ],
  },
  modules: ["@wxt-dev/module-solid"],
  imports: false,
  srcDir: "src",
});
