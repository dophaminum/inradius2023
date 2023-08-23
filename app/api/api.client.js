// const { API_URL } = window.__ENV__;

const MARKERS_CACHE_KEY = "markers";
const MARKERS_HASH_CACHE_KEY = "markersHash";

const oldData = JSON.parse(localStorage.getItem(MARKERS_CACHE_KEY));
const hash = localStorage.getItem(MARKERS_HASH_CACHE_KEY);

export async function fetchMarkersIfNeeded() {
  if (oldData && hash) return fetchMarkers(hash);

  return fetchMarkers(); // Вызываем функцию fetchMarkers, так как данные отсутствуют
}

export async function fetchMarkers(markersHash) {
  console.log({ fetchMarkers: { markersHash } });
  const url = markersHash ? `/api/markers?hash=${markersHash}` : "/api/markers";
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  const data = await response.json();
  return saveDateLocalStoreg({ data, markersHash });
}

function saveDateLocalStoreg({ markersHash, data }) {
  // Проверяем, что полученные данные совпадают с данными из localStorage
  if (data.hash === markersHash) {
    //
    return oldData;
    //
  } else {
    localStorage.setItem(MARKERS_CACHE_KEY, JSON.stringify(data.markers));
    localStorage.setItem(MARKERS_HASH_CACHE_KEY, data.hash);

    return data.markers;
  }
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
