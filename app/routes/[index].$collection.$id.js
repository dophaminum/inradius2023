import { redirect } from "@remix-run/node";
import { getBotLocale } from "~/utils/server";

export async function loader({ request }) {
  const url = new URL(request.url);

  let locale = await getBotLocale(request);
  return redirect(`/${locale}${url.pathname}`, {
    status: 301,
    headers: { "Cache-Control": "no-cache" },
  });
}
