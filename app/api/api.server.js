import collection_map from "../config/collection_names.json";
import config from "../../config.server";
import { fetch } from "@remix-run/node";
import cache from "~/cache/index";

const MARKERS_CACHE_KEY = "markers";
const EVENT_CACHE_KEY = "event";

const { API_URL, API_URL_SECOND } = config;

export async function fetchMarkers() {
  let markers = cache.get(MARKERS_CACHE_KEY);

  if (markers) {
    return markers;
  }

  const response = await fetch(API_URL + "public/file.txt");
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  markers = await response.json();
  if (markers?.length) {
    cache.set(MARKERS_CACHE_KEY, markers, 1000 * 60 * 10); //? 10 минут кэширования маркеров;
  }

  return markers;
}

export async function fetchEvent({ id, collection }) {
  const key = `${EVENT_CACHE_KEY}::${collection}::${id}`;

  let event = cache.get(key);

  if (event) {
    return event;
  }

  const response = await fetch(API_URL + `collections/${collection}/${id}`);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  event = (await response.json()).data;

  if (event) {
    cache.set(key, event, 1000 * 60 * 10); //? 10 минут кэширования события;
  }

  return event;
}

export async function fetchSearchEvent({ text }) {
  return text
    ? (
        await Promise.all(
          collection_map.search_collections.map(async (collection) => {
            const response = await fetch(
              API_URL_SECOND +
                `collections/${collection}/${encodeURIComponent(text)}`
            );

            if (!response.ok) {
              throw new Error("Network response was not ok");
            }

            return (await response.json()) ?? [];
          })
        )
      ).reduce((prev, cur) => prev.concat(cur), []) ?? []
    : undefined;
}
