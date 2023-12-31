import Backend from "i18next-fs-backend";
import { resolve } from "node:path";
import { RemixI18Next } from "remix-i18next";

export let i18n = new RemixI18Next({
  detection: {
    // This is the list of languages your application supports
    supportedLanguages: ["en", "ru", "es"],
    // This is the language you want to use in case the user language is not
    // listed above
    // order: ['searchParams', 'cookie', 'session'],
    fallbackLanguage: "en",
  },
  // This is the configuration for i18next used when translating messages server
  // side only
  i18next: {
    keySeparator: ".",
    defaultNS: "translation",
    backend: { loadPath: resolve("./public/locales/{{lng}}/{{ns}}.json") },
    fallbackLng: "en",
  },
  // The backend you want to use to load the translations
  // Tip: You could pass `resources` to the `i18next` configuration and avoid
  // a backend here
  backend: Backend,
});
