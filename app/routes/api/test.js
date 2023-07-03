export async function loader({ params }) {
  return new Response(JSON.stringify({ 2: "2" }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
