import { CacheProvider } from "@emotion/react";
import { RemixBrowser } from "@remix-run/react";
import { QueryClientProvider } from "@tanstack/react-query";
import i18next from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import Backend from "i18next-http-backend";
import { useCallback, useState } from "react";
import { I18nextProvider, initReactI18next } from "react-i18next";
import { getInitialNamespaces } from "remix-i18next";
import emotionCache from "./emotionCache";
import ClientStyleContext from "./styles/client.context";

import queryClient from "~/api/queryClinet";

const { hydrateRoot } = require("react-dom/client");

function ClientCacheProvider({ children }) {
  const [cache, setCache] = useState(emotionCache);

  const reset = useCallback(() => {
    setCache(emotionCache);
  }, []);

  return (
    <ClientStyleContext.Provider value={{ reset }}>
      <CacheProvider value={cache}>{children}</CacheProvider>
    </ClientStyleContext.Provider>
  );
}

i18next
  .use(initReactI18next) // Tell i18next to use the react-i18next plugin
  .use(LanguageDetector) // Setup a client-side language detector
  .use(Backend) // Setup your backend
  .init({
    // This is normal i18next config, except a few things
    supportedLngs: ["en", "ru", "es"],
    defaultNS: "translation",
    fallbackLng: "en",
    // Disabling suspense is recommended
    keySeparator: ".",
    react: { useSuspense: false },
    // This function detects the namespaces your routes rendered while SSR use
    // and pass them here to load the translations
    ns: getInitialNamespaces(),
    backend: { loadPath: "/locales/{{lng}}/{{ns}}.json" },
    detection: {
      // Here only enable htmlTag detection, we'll detect the language only
      // server-side with remix-i18next, by using the `<html lang>` attribute
      // we can communicate to the client the language detected server-side
      order: ["htmlTag"],
      // Because we only use htmlTag, there's no reason to cache the language
      // on the browser, so we disable it
      caches: [],
    },
  })
  .then(() => {
    hydrateRoot(
      document,
      <QueryClientProvider client={queryClient}>
        <I18nextProvider i18n={i18next}>
          <ClientCacheProvider>
            <RemixBrowser />
          </ClientCacheProvider>
        </I18nextProvider>
      </QueryClientProvider>
    );
  });
