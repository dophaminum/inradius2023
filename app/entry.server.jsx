import { RemixServer } from "@remix-run/react";
import { createInstance } from "i18next";
import Backend from "i18next-fs-backend";
import { resolve } from "node:path";
import { PassThrough } from "node:stream";
import { I18nextProvider, initReactI18next } from "react-i18next";
import { i18n } from "./i18n.server";

import { CacheProvider } from "@emotion/react";
import createEmotionServer from "@emotion/server/create-instance";
import emotionCache from "./emotionCache";
import ServerStyleContext from "./styles/server.context";
import { QueryClientProvider } from "@tanstack/react-query";
import queryClient from "~/api/queryClinet";
import { getBotLocale } from "./utils/server";
import { cors } from "remix-utils";

//! ssl отвалился
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const chalk = require("chalk");
const { renderToPipeableStream, renderToString } = require("react-dom/server");

const { extractCriticalToChunks } = createEmotionServer(emotionCache);

const ABORT_DELAY = 10_000;

export default async function handleRequest(
  request,
  statusCode,
  headers,
  context
) {
  // First, we create a new instance of i18next so every request will have a
  // completely unique instance and not share any state
  let instance = createInstance();

  // Then we could detect locale from the request
  let lng = context?.matches?.[0]?.params?.lng
    ? context.matches[0].params.lng
    : await getBotLocale(request);

  console.log(
    chalk.blue.bold("[remix] Request 'User-Agent' =") +
      chalk.blue(` ( ${request?.headers?.get("user-agent")} )`)
  );

  // And here we detect what namespaces the routes about to render want to use
  let ns = i18n.getRouteNamespaces(context);

  await instance
    .use(initReactI18next) // Tell our instance to use react-i18next
    .use(Backend) // Setup our backend
    .init({
      // And configure i18next as usual
      supportedLngs: ["en", "ru", "es"],
      defaultNS: "translation",
      fallbackLng: "en",
      // Disable suspense again here
      keySeparator: '.',
      react: { useSuspense: false },
      lng, // The locale we detected above
      ns, // The namespaces the routes about to render want to use
      backend: {
        loadPath: resolve("./public/locales/{{lng}}/{{ns}}.json"),
      },
    });

  // Then you can render your app wrapped in the I18nextProvider as in the
  // entry.client file

  return new Promise((resolve, reject) => {
    let didError = false;

    const html = renderToString(
      <QueryClientProvider client={queryClient}>
        <I18nextProvider i18n={instance}>
          <ServerStyleContext.Provider value={null}>
            {/* <CacheProvider value={emotionCache}> */}
            <RemixServer context={context} url={request.url} />
            {/* </CacheProvider> */}
          </ServerStyleContext.Provider>
        </I18nextProvider>
      </QueryClientProvider>
    );

    const chunks = extractCriticalToChunks(html);

    const stream = renderToPipeableStream(
      <QueryClientProvider client={queryClient}>
        <I18nextProvider i18n={instance}>
          <ServerStyleContext.Provider value={chunks.styles}>
            <CacheProvider value={emotionCache}>
              <RemixServer context={context} url={request.url} />
            </CacheProvider>
          </ServerStyleContext.Provider>
        </I18nextProvider>
      </QueryClientProvider>,
      {
        onShellReady: () => {
          const body = new PassThrough();

          headers.set("Content-Type", "text/html");

          resolve(
            new Response(body, {
              headers: headers,
              status: didError ? 500 : statusCode,
            })
          );

          stream.pipe(body);
        },
        onShellError: (err) => {
          reject(err);
        },
        onError: (error) => {
          didError = true;

          console.error(error);
        },
      }
    );

    setTimeout(stream.abort, ABORT_DELAY);
  });
}

export let handleDataRequest = async (response, { request }) => {
  return await cors(request, response);
};
