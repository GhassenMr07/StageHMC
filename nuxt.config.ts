// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-12-23",
  ssr: false,
  experimental: {
    payloadExtraction: false,
  },
  nitro: {
    experimental: {
      appManifest: false,
    },
  },
  app: {
    head: {
      title: "HMC Information Portal",
      // titleTemplate: (subPage:string) => {
      //   return subPage
      //     ? `HMC IP - ${subPage}`
      //     : "HMC Information Portal";
      // },
      charset: "utf-8",
      viewport: "width=device-width, initial-scale=1",
    }
  },
  css: ["~/assets/main.css"],
  modules: [
    ["@nuxtjs/eslint-module", {
      failOnWarning: true,
      failOnError: true,
      fix: true,
    }],
    ["@nuxtjs/i18n", {
      lazy: false,
      langDir: "lang",
      defaultLocale: "en",
      strategy: "no_prefix",
      detectBrowserLanguage: {
        useCookie: true,
        // alwaysRedirect: true,
        cookieKey: "i18n_redirected",
        redirectOn: "root", // recommended
      },
      locales: [
        {
          code: "en",
          name: "English",
          files: [
            "Components.yaml",
            "Footer.yaml",
            "Header.yaml",
            "MappingItem.yaml",
            "MappingItemList.yaml",
            "StartPage.yaml",
            "Pagination.yaml",
            "generalKeys.yaml",
            "RessourceName.yaml",
          ],
        },
        {
          code: "de",
          name: "Deutsch",
          files: [
            "./de/Components_de.yaml",
            "./de/Footer_de.yaml",
            "./de/Header_de.yaml",
            "./de/MappingItem_de.yaml",
            "./de/MappingItemList_de.yaml",
            "./de/StartPage_de.yaml",
            "./de/Pagination_de.yaml",
            "./de/generalKeys_de.yaml",
            "./de/RessourceName_de.yaml",
          ],
        },
      ],
    }],
    "@nuxtjs/tailwindcss",
  ],
  runtimeConfig: {
    baseUrl: "",
    public: {
      apiBaseUrl: "", // Add your API base URL here when needed
    },
  },
  vite: {
    optimizeDeps: {
      include: ["unhead"]
    }
  },
});
