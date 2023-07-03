import config from "../config.server";
import metaConfig from "~/config/meta_config.json";

import { json, redirect } from "@remix-run/node";
import { i18n } from "~/i18n.server.js";
import { useChangeLanguage } from "remix-i18next";
import { useTranslation } from "react-i18next";

import globalStylesUrl from "~/styles/global.css";
import { useContext, useEffect, useMemo } from "react";
import ServerStyleContext from "./styles/server.context";
import ClientStyleContext from "./styles/client.context";

import locale_en from "antd/es/locale/en_US";
import locale_ru from "antd/es/locale/ru_RU";
import locale_es from "antd/es/locale/es_ES";

import dayjs from "dayjs";

import "dayjs/locale/ru";
import "dayjs/locale/es";
import "dayjs/locale/en";

import localizedFormat from "dayjs/plugin/localizedFormat";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";

// export const unstable_shouldReload = () => false;

import { withEmotionCache } from "@emotion/react";
import { ConfigProvider } from "antd";
import MapLayout from "./components/MapLayout/MapLayout";
import { getAlternates, getCanonical } from "./utils";
import { DynamicLinks } from "./components/DynamicLinks";
import { ClientOnly } from "remix-utils";

const ALLOWED_LANGS = ["ru", "en", "es"];

let isMount = true;

const {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useMatches,
  useLocation,
} = require("@remix-run/react");

dayjs.extend(localizedFormat);
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

export const meta = ({ data }) => {
  return {
    "yandex-verification": "fa477f4b883c9eff",
    charset: "utf-8",
    title: data.meta.title,
    description: data.meta.description,
    viewport: "width=device-width,initial-scale=1",
    "og:type": "website",
    "og:url": `${metaConfig.WEBSITE_URL}/${data.locale}`,
    "og:title": data.meta.title,
    "og:description": data.meta.description,
    "og:image": metaConfig.META_SITE_IMAGE,
    "og:site_name": metaConfig.META_SITE_NAME,
    "twitter:card": "summary_large_image",
    "twitter:url": `${metaConfig.WEBSITE_URL}/${data.locale}`,
    "twitter:title": data.meta.title,
    "twitter:description": data.meta.description,
    "twitter:image": metaConfig.META_SITE_IMAGE,
    "twitter:site_name": metaConfig.META_SITE_NAME,
  };
};

export const links = () => {
  return [
    {
      rel: "stylesheet",
      href: globalStylesUrl,
    },
    { rel: "icon", href: "/favicon.svg" },
  ];
};

export let loader = async ({ request, params }) => {
  let locale = params?.lng ?? (await i18n.getLocale(request));

  if (params?.lng && !ALLOWED_LANGS.includes(locale)) {
    return redirect(`/404`, {
      status: 301,
      headers: { "Cache-Control": "no-cache" },
    });
  }

  let canonical = getCanonical(request.url, metaConfig.WEBSITE_URL);

  let alternates = getAlternates(request.url, metaConfig.WEBSITE_URL);

  const t = await i18n.getFixedT(locale);

  let meta = {
    title: t("metaTitle"),
    description: t("metaDescription"),
  };

  return json({
    alternates,
    canonical,
    locale,
    meta,
    ENV: {
      API_URL: config.API_URL,
      API_URL_SECOND: config.API_URL_SECOND,
    },
  });
};

export let handle = {
  i18n: ["translation"],
};

export default withEmotionCache(function App(_, emotionCache) {
  const serverStyleData = useContext(ServerStyleContext);
  const clientStyleData = useContext(ClientStyleContext);

  let location = useLocation();
  let matches = useMatches();

  useEffect(() => {
    let mounted = isMount;
    isMount = false;
    if ("serviceWorker" in navigator) {
      if (navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller?.postMessage({
          type: "REMIX_NAVIGATION",
          isMount: mounted,
          location,
          matches,
          manifest: window.__remixManifest,
        });
      } else {
        let listener = async () => {
          await navigator.serviceWorker.ready;
          navigator.serviceWorker.controller?.postMessage({
            type: "REMIX_NAVIGATION",
            isMount: mounted,
            location,
            matches,
            manifest: window.__remixManifest,
          });
        };
        navigator.serviceWorker.addEventListener("controllerchange", listener);
        return () => {
          navigator.serviceWorker.removeEventListener(
            "controllerchange",
            listener
          );
        };
      }
    }
  }, [location, matches]);

  // Only executed on client
  useEffect(() => {
    // re-link sheet container
    emotionCache.sheet.container = document.head;

    // re-inject tags
    const tags = emotionCache.sheet.tags;
    emotionCache.sheet.flush();
    tags.forEach((tag) => {
      emotionCache.sheet._insertTag(tag);
    });

    // reset cache to re-apply global styles
    clientStyleData.reset();
  }, [clientStyleData, emotionCache.sheet]);

  let { locale, ENV, canonical, alternates } = useLoaderData();

  let { i18n } = useTranslation();

  dayjs.locale(i18n.resolvedLanguage);

  const antdLocale = useMemo(() => {
    switch (i18n.resolvedLanguage) {
      case "ru":
        return locale_ru;
      case "es":
        return locale_es;
      default:
        return locale_en;
    }
  }, [i18n.resolvedLanguage]);

  useChangeLanguage(locale);
  return (
    <html lang={i18n.resolvedLanguage} dir={i18n.dir()}>
      <head>
      <script
                  async
                  src="https://www.googletagmanager.com/gtag/js?id=G-2544PCHLP8"
                />
         <script
                  dangerouslySetInnerHTML={{
                    __html: `function gtag(){dataLayer.push(arguments)}window.dataLayer=window.dataLayer||[],gtag("js",new Date),gtag("config","G-2544PCHLP8");`,
                  }}
      ></script>
      <script
        dangerouslySetInnerHTML={{
        __html: `!function(e,t,a,c,n,r,i){e[n]=e[n]||function(){(e[n].a=e[n].a||[]).push(arguments)},e[n].l=1*new Date,r=t.createElement(a),i=t.getElementsByTagName(a)[0],r.async=1,r.src=c,i.parentNode.insertBefore(r,i)}(window,document,"script","https://mc.yandex.ru/metrika/tag.js","ym"),ym(89810529,"init",{clickmap:!0,trackLinks:!0,accurateTrackBounce:!0});`,
                  }}
                ></script>
                       
      
                 
        <Meta />

        {process.env.NODE_ENV === "development" ? null : (
          <ClientOnly>
            {() => (
              <>


              </>
            )}
          </ClientOnly>
        )}
        <DynamicLinks />
        <meta name="theme-color" content="#000000" />
        <link rel="manifest" href="/resources/manifest.webmanifest" />
        {canonical && <link rel="canonical" href={canonical} />}
        {alternates.map((link) => (
          <link {...link} key={link.href} />
        ))}

        <Links />
        {serverStyleData?.map(({ key, ids, css }) => (
          <style
            key={key}
            data-emotion={`${key} ${ids.join(" ")}`}
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{ __html: css }}
          />
        ))}
      </head>
      <body>

        <ConfigProvider locale={antdLocale}>
         
          <Outlet />
        </ConfigProvider>
        <LiveReload />
        <ScrollRestoration />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.__ENV__ = ${JSON.stringify(ENV ?? {})}`,
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `"serviceWorker"in navigator&&window.addEventListener("load",()=>{navigator.serviceWorker.register("/entry.worker.js").then(()=>navigator.serviceWorker.ready).then(()=>{navigator.serviceWorker.controller?navigator.serviceWorker.controller.postMessage({type:"SYNC_REMIX_MANIFEST",manifest:window.__remixManifest}):navigator.serviceWorker.addEventListener("controllerchange",()=>{navigator.serviceWorker.controller?.postMessage({type:"SYNC_REMIX_MANIFEST",manifest:window.__remixManifest})})}).catch(e=>{})});`,
          }}
        ></script>
        
        <Scripts />
        <MapLayout />
      </body>
    </html>
  );
});
