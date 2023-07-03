import isbot from "isbot";
import metaConfig from "~/config/meta_config.json";
import { i18n } from "~/i18n.server";

export async function getBotLocale(request) {
  return isbot(request?.headers?.get("user-agent"))
    ? metaConfig.CANONICAL_LANG
    : await i18n.getLocale(request);
}
