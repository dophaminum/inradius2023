import { redirect } from "@remix-run/node";
import { getBotLocale } from "~/utils/server";

export async function loader({ request }) {
  let locale = await getBotLocale(request);
  return redirect(`/${locale}/404`, {
    status: 301,
    headers: { "Cache-Control": "no-cache" },
  });
}
