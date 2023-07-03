import { fetchEvent } from "~/api/api.server";

export async function loader({ params }) {
  let event = await fetchEvent(params);

  return new Response(JSON.stringify(event), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
