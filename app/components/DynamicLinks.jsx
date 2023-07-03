import { useMatches } from "@remix-run/react";
import { useTranslation } from "react-i18next";
import { derializeFunction } from "~/utils";
import meta_config from "../config/meta_config.json";

export function DynamicLinks() {
  const { i18n } = useTranslation();
  let links = useMatches()
    .flatMap((match) => {
      let fn = match.handle?.dynamicLinks;
      if (typeof fn !== "string") return [];

      try {
        fn = derializeFunction(fn);
        return fn({ data: match.data });
      } catch (e) {
        console.error(e);
        return [];
      }
    })
    .map((link) => ({
      ...link,
      ...(link?.href && {
        href: link.href
          .replace(":AMP_WEBSITE_URL:", meta_config.AMP_WEBSITE_URL)
          .replace(":LANG:", i18n.resolvedLanguage),
      }),
    }));

  return (
    <>
      {links.map((link) => (
        <link {...link} key={link.integrity || JSON.stringify(link)} />
      ))}
    </>
  );
}
