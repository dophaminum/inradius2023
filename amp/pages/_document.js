import Document, { Html, Head, Main, NextScript } from "next/document";
import i18nextConfig from "../next-i18next.config";

import "dayjs/locale/ru";
import "dayjs/locale/es";
import "dayjs/locale/en";

import localizedFormat from "dayjs/plugin/localizedFormat";
import dayjs from "dayjs";
dayjs.extend(localizedFormat);

class MyDocument extends Document {
  render() {
    const currentLocale =
      this.props.__NEXT_DATA__.query.locale || i18nextConfig.i18n.defaultLocale;
    return (
      <Html lang={currentLocale}>
        <Head>
          <link
            href="https://fonts.googleapis.com/css?family=Roboto:200,300,400,500,700"
            rel="stylesheet"
            type="text/css"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
