// const { API_URL } = window.__ENV__;

export async function fetchMarkers() {
  const response = await fetch("/api/markers");
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
}

export async function fetchEvent({ id, collection }) {
  const response = await fetch(`/api/event/${collection}/${id}`);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  return await response.json();
}

export async function fetchSearchEvent({ text }) {
  const response = await fetch(`/api/event/${text}`);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  return await response.json();
}
