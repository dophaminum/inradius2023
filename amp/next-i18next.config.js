const path = require("path");

module.exports = {
  // https://www.i18next.com/overview/configuration-options#logging
  debug: process.env.NODE_ENV === "development",
  i18n: {
    defaultLocale: "en",
    locales: ["en", "ru", "es"],
  },
  ns: "translation",
  defaultNS: "translation",
  localePath: path.resolve("../public/locales"),
  reloadOnPrerender: process.env.NODE_ENV === "development",
};
