import { fetchMarkers } from "~/api/api.server";

export async function loader({ params }) {
  let events = (await fetchMarkers()) ?? [];

  return new Response(JSON.stringify(events), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
