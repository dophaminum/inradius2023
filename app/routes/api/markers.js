import { fetchMarkers } from "~/api/api.server";

export async function loader({ request }) {
  const url = new URL(request.url);
  const query = url.searchParams.get("hash");

  let events = (await fetchMarkers(query)) ?? [];

  return new Response(JSON.stringify(events), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
