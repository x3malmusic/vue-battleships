const path = require("path");

module.exports = {
  pluginOptions: {
    i18n: {
      locale: "en",
      fallbackLocale: "en",
      localeDir: "locales",
      enableInSFC: true,
    },
  },
  css: {
    loaderOptions: {
      sass: {
        sassOptions: {
          includePaths: [path.resolve(__dirname, "src")],
        },
        prependData: `@import "./src/assets/styles/main.scss";
                      @import "./src/assets/styles/fonts.scss";
                      `,
      },
    },
  },
  assetsDir: "@/assets",
};
