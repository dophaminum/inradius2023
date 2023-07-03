import "../styles/globals.css";
import favicon from "../../public/favicon.svg";

import { appWithTranslation } from "next-i18next";
import Head from "next/head";

const MyApp = ({ Component, pageProps }) => (
  <>
    <Head>
      <link rel="shortcut icon" href={`${favicon.src}`} />
    </Head>
    <Component {...pageProps} />
  </>
);

export default appWithTranslation(MyApp);
