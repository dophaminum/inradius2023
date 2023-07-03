import { fetchEvent } from "../../../api";
import {
  getEventLDdata,
  getMetaData,
  normilizeEventData,
} from "../../../../app/utils/index";
import collection_names from "../../../../app/config/collection_names.json";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";
import meta_config from "../../../../app/config/meta_config.json";
import { NextSeo } from "next-seo";
import Head from "next/head";
import favicon from "../../../../public/favicon.svg";
import chalk from "chalk";
import { getAlternates } from "../../../utils/index";

export const config = { amp: true };

export default function Home({ params, data, jsonld, meta }) {
  const { t, i18n } = useTranslation();

  return (
    <>
      <amp-analytics
        config="https://www.googletagmanager.com/amp.json?id=GTM-MWVS7J8&gtm.url=SOURCE_URL"
        data-credentials="include"
      ></amp-analytics>

      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonld, null, 2),
          }}
        ></script>
      </Head>

      <NextSeo
        title={meta?.title}
        canonical={`${meta_config.WEBSITE_URL}/${i18n.resolvedLanguage}/index/${params.collection}/${params.id}`}
        description={meta?.description}
        openGraph={{
          title: meta?.title,
          description: meta?.description,
          images: meta?.images,
          url: `${meta_config.AMP_WEBSITE_URL}/${i18n.resolvedLanguage}/index/${params.collection}/${params.id}`,
        }}
        twitter={{
          cardType: "summary_large_image",
          images: meta?.images,
        }}
        languageAlternates={meta?.alternates}
      />

      <style jsx global>{`
        html {
          line-height: 1.15;
          -webkit-text-size-adjust: 100%;
        }

        body {
          margin: 0;
        }

        main {
          display: block;
        }

        h1 {
          font-size: 2em;
          margin: 0.67em 0;
        }

        hr {
          box-sizing: content-box;
          height: 0;
          overflow: visible;
        }

        pre {
          font-family: monospace, monospace; /* 1 */
          font-size: 1em; /* 2 */
        }

        a {
          background-color: transparent;
        }

        abbr[title] {
          border-bottom: none; /* 1 */
          text-decoration: underline; /* 2 */
          text-decoration: underline dotted; /* 2 */
        }

        b,
        strong {
          font-weight: bolder;
        }

        code,
        kbd,
        samp {
          font-family: monospace, monospace;
          font-size: 1em;
        }

        small {
          font-size: 80%;
        }

        sub,
        sup {
          font-size: 75%;
          line-height: 0;
          position: relative;
          vertical-align: baseline;
        }

        sub {
          bottom: -0.25em;
        }

        sup {
          top: -0.5em;
        }

        img {
          border-style: none;
        }

        button,
        input,
        optgroup,
        select,
        textarea {
          font-family: inherit;
          font-size: 100%;
          line-height: 1.15;
          margin: 0;
        }

        button,
        input {
          overflow: visible;
        }

        button,
        select {
          text-transform: none;
        }

        button,
        [type="button"],
        [type="reset"],
        [type="submit"] {
          -webkit-appearance: button;
        }

        button::-moz-focus-inner,
        [type="button"]::-moz-focus-inner,
        [type="reset"]::-moz-focus-inner,
        [type="submit"]::-moz-focus-inner {
          border-style: none;
          padding: 0;
        }

        button:-moz-focusring,
        [type="button"]:-moz-focusring,
        [type="reset"]:-moz-focusring,
        [type="submit"]:-moz-focusring {
          outline: 1px dotted ButtonText;
        }

        fieldset {
          padding: 0.35em 0.75em 0.625em;
        }

        legend {
          box-sizing: border-box;
          color: inherit;
          display: table;
          max-width: 100%;
          padding: 0;
          white-space: normal;
        }

        progress {
          vertical-align: baseline;
        }

        textarea {
          overflow: auto;
        }

        [type="checkbox"],
        [type="radio"] {
          box-sizing: border-box;
          padding: 0;
        }

        [type="number"]::-webkit-inner-spin-button,
        [type="number"]::-webkit-outer-spin-button {
          height: auto;
        }

        [type="search"] {
          -webkit-appearance: textfield;
          outline-offset: -2px;
        }

        [type="search"]::-webkit-search-decoration {
          -webkit-appearance: none;
        }

        ::-webkit-file-upload-button {
          -webkit-appearance: button;
          font: inherit;
        }

        details {
          display: block;
        }

        summary {
          display: list-item;
        }

        template {
          display: none;
        }

        [hidden] {
          display: none;
        }

        /*  */
        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
          padding: 0;
          font-family: "Roboto", sans-serif;
        }

        a {
          text-decoration: none;
        }

        img {
          max-width: 100%;
          object-fit: contain;
        }

        ul,
        ol {
          display: block;
          padding-left: 1.2rem;
        }

        .headerbar {
          height: 50px;
          position: fixed;
          z-index: 999;
          background: #039be5;
          top: 0;
          left: 0;
          width: 100%;
          box-shadow: 0 2px 4px rgb(0 0 0 / 50%);
          color: white;
        }
        .headerbar__inner {
          margin: 0 auto;
          align-items: center;
          display: flex;
          padding: 0.2rem 0.5rem;
          height: 100%;
        }

        .headerbar a {
          color: white;
          display: inline-block;
          margin-bottom: -4px;
          height: 36px;
          width: 36px;
        }

        .headerbar .home-button {
          margin-top: 8px;
          fill: white;
        }

        .headerbar .site-name {
          font-size: 1.5rem;
          margin: 0 auto;
        }

        .btn {
          display: inline-block;
          font-weight: 400;
          text-align: center;
          white-space: nowrap;
          vertical-align: middle;
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          user-select: none;
          border: 1px solid transparent;
          padding: 0.375rem 0.75rem;
          font-size: 1rem;
          line-height: 1.5;
          border-radius: 0.25rem;
          transition: color 0.15s ease-in-out,
            background-color 0.15s ease-in-out, border-color 0.15s ease-in-out,
            box-shadow 0.15s ease-in-out;
        }

        .btn-primary {
          color: #fff;
          background-color: #007bff;
          border-color: #007bff;
        }

        .btn-primary:hover {
          color: #fff;
          background-color: #0069d9;
          border-color: #0062cc;
        }
        .btn-primary:not(:disabled):not(.disabled).active:focus,
        .btn-primary:not(:disabled):not(.disabled):active:focus {
          box-shadow: 0 0 0 0.2rem rgb(0 123 255 / 50%);
        }
        .btn-primary:not(:disabled):not(.disabled).active,
        .btn-primary:not(:disabled):not(.disabled):active {
          color: #fff;
          background-color: #0062cc;
          border-color: #005cbf;
        }
      `}</style>

      <style jsx>{`
        .event {
          margin-top: 70px;
          padding: 0.5rem 1rem;
          display: flex;
          flex-direction: column;
        }

        .event > * {
          margin-bottom: 1rem;
        }

        .event > *:last-child {
          margin-bottom: 0;
        }

        .event .event__title {
          margin-bottom: 2rem;
        }
        .event__guide_details {
          padding: 0.125rem 0;
        }
        .event__addres_guide_bio {
          display: flex;
          padding: 0.75rem 0;
          justify-content: space-between;
        }

        .event__addres_guide_bio *:first-child {
          margin: 0 auto;
          flex-shrink: 1;
          padding-right: 0.25rem;
        }

        .event__addres_guide_bio *:last-child {
          margin: 0 auto;
          flex-shrink: 0;
        }

        .event__styled_addres {
          padding: 0.25rem 0;
          font-size: 1.1rem;
        }

        .event__datetimes {
          display: flex;
          justify-content: center;
        }

        .event__datetimes_inner > span {
          margin-left: 0.5rem;
        }

        .event__datetimes_inner > span:first-of-type {
          margin-left: 0;
        }

        .event__button {
          cursor: pointer;
        }

        .event__summory h2 {
          font-size: 1rem;
          margin: 0;
        }

        @media (max-width: 30em) {
          .event {
            padding: 0.25rem 0.25rem;
            font-size: 0.75rem;
          }

          .event__summory h2 {
            font-size: 0.75rem;
          }
        }

        @media (max-width: 42rem) {
          .event__addres_guide_bio {
            flex-direction: column-reverse;
          }

          .event__addres_guide_bio *:last-child {
            margin-bottom: 0.5rem;
          }
        }
      `}</style>

      <header className="headerbar">
        <div className="headerbar__inner">
          <a
            href={`${meta_config.WEBSITE_URL}/${i18n.resolvedLanguage}/index/${params.collection}/${params.id}`}
          >
            <svg
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 64 64"
            >
              <path d="M 32 3 L 1 28 L 1.4921875 28.654297 C 2.8591875 30.477297 5.4694688 30.791703 7.2304688 29.345703 L 32 9 L 56.769531 29.345703 C 58.530531 30.791703 61.140812 30.477297 62.507812 28.654297 L 63 28 L 54 20.742188 L 54 8 L 45 8 L 45 13.484375 L 32 3 z M 32 13 L 8 32 L 8 56 L 56 56 L 56 35 L 32 13 z M 26 34 L 38 34 L 38 52 L 26 52 L 26 34 z" />
            </svg>
          </a>
          <div className="site-name">🗺️ InRadius</div>
        </div>
      </header>
      <div className="event">
        <h1 className="event__title">{data.title}</h1>
        {data?.images?.length && (
          <amp-carousel
            id="carousel-with-preview"
            width="450"
            height="300"
            layout="responsive"
            controls
            role="region"
            type="slides"
            tabindex="0"
          >
            {data.images?.map((img_href) => (
              <amp-img
                key={img_href}
                src={img_href}
                width="450"
                height="300"
                layout="responsive"
              ></amp-img>
            ))}
          </amp-carousel>
        )}
        {data?.summory && (
          <div className="event__summory">
            <h2 dangerouslySetInnerHTML={{ __html: data.summory }}></h2>
          </div>
        )}
        {data?.description && (
          <div
            className="event__description"
            dangerouslySetInnerHTML={{ __html: data.description }}
          ></div>
        )}
        {(data?.max_persons ||
          data?.price ||
          data?.guide ||
          data?.movement_type) && (
          <div className="event__guide_details">
            {(data?.meeting_point || data?.address) && (
              <div>
                {t("Meeting point")}: {data?.meeting_point || data?.address}
              </div>
            )}
            {data?.max_persons && (
              <div>
                {t("Max persons")}: {data.max_persons}
              </div>
            )}
            {data?.price && (
              <div>
                {t("Price")}: {data.price}
              </div>
            )}
            {data?.movement_type && (
              <div>
                {t("Movement type")}: {t(data.movement_type)}
              </div>
            )}
            {data?.guide && (
              <div>
                {t("Your guide")}: {data.guide}
              </div>
            )}
          </div>
        )}
        {(data?.guide_description || data?.guide_avatar) && (
          <div className="event__addres_guide_bio">
            {data?.guide_description && <div>{data.guide_description}</div>}
            {data?.guide_avatar && (
              <amp-img
                src={data.guide_avatar}
                alt="guide avatar"
                height="150"
                width="150"
                layout="flex-item"
              ></amp-img>
            )}
          </div>
        )}
        {(data?.meeting_point || data?.address) && params.collection !== "tr" && (
          <div
            className="event__styled_addres"
            dangerouslySetInnerHTML={{
              __html: data?.address || data?.meeting_point,
            }}
          ></div>
        )}
        {((data?.start_date && data?.end_date) ||
          (data?.start_datetime && data?.end_datetime)) && (
          <div className="event__datetimes">
            <div className="event__datetimes_inner">
              {(data?.start_datetime || data?.start_date)?.map((date, i) => (
                <span key={i}>
                  {dayjs(date)
                    .locale(i18n.resolvedLanguage)
                    .format(dayjs(date).hour() === 0 ? "LL" : "LLL")}
                </span>
              ))}
              <span>-</span>
              {(data?.end_datetime || data?.end_date)?.map((date, i) => (
                <span key={i}>
                  {dayjs(date)
                    .locale(i18n.resolvedLanguage)
                    .format(dayjs(date).hour() === 0 ? "LL" : "LLL")}
                </span>
              ))}
            </div>
          </div>
        )}
        {params?.collection === "tr" && (
          <button
            className="btn btn-primary event__button"
            on={`tap:AMP.navigateTo(url='${`${meta_config.OLD_SITE_FALLBACK}/index/${params.collection}/${params.id}`}')`}
          >
            {t("Submit an application")}
          </button>
        )}
      </div>
    </>
  );
}

export async function getServerSideProps(context) {
  let data = await fetchEvent({
    id: context.query.id,
    collection: collection_names.all_collections[context.query.collection],
  });
  if (!data || !["en", "ru", "es"].includes(context.locale)) {
    return {
      notFound: true,
    };
  }

  data = normilizeEventData(data, context.locale);
  const jsonld = getEventLDdata(data);
  const meta = getMetaData(data, context.locale);

  meta.images = meta?.images?.length
    ? meta.images.map((src) => ({ url: src }))
    : [{ url: favicon.src }];

  const userAgent = context.req.headers["user-agent"];

  console.log(
    chalk.magenta(chalk.bold(`[amp] Request 'User-Agent' = ( ${userAgent} )`))
  );

  meta.alternates = getAlternates(context.req.url, meta_config.AMP_WEBSITE_URL);

  return {
    props: {
      ...(await serverSideTranslations(context.locale, ["translation"])),
      params: context.query,
      data,
      jsonld,
      meta,
    },
  };
}
