export function getAlternates(
  pathname,
  canonical_uri,
  langs = ["ru", "es", "en"]
) {
  let links = langs.map((lang) => {
    return {
      hrefLang: lang,
      href: `${canonical_uri}/${lang}${pathname}`,
    };
  });

  return links?.length ? links : [];
}
