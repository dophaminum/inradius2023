import { fetchSearchEvent } from "~/api/api.server";

export async function loader({ params }) {
  let events = (await fetchSearchEvent(params)) ?? [];

  return new Response(JSON.stringify(events), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
