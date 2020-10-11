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
        prependData: `@import "./src/assets/styles/_animations.scss";
                      @import "./src/assets/styles/_breakpoints.scss";
                      @import "./src/assets/styles/_mixins.scss";
                      @import "./src/assets/styles/_variables.scss";
                      @import "./src/assets/styles/fonts.scss";
                      `,
      },
    },
  },
};
