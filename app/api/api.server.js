import collection_map from "../config/collection_names.json";
import config from "../../config.server";
import { fetch } from "@remix-run/node";
import cache from "~/cache/index";
import sha256 from "crypto-js/sha256";

const EVENT_CACHE_KEY = "event";
const MARKERS_CACHE_KEY = "markers";
const MARKERS_HASH_CACHE_KEY = "markersHash";

const { API_URL, API_URL_SECOND } = config;

export async function fetchMarkers(markersHash) {
  let markers = cache.get(MARKERS_CACHE_KEY);
  let hash = cache.get(MARKERS_HASH_CACHE_KEY);

  if (hash && markers) {
    // проверка: сравниваем хеши
    if (hash === markersHash) {
      return {
        hash,
        markers: "ok",
      };
    }
    return {
      hash,
      markers,
    };
  }

  const response = await fetch(API_URL + "public/file.txt");
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  markers = await response.json();
  hash = sha256(JSON.stringify(markers)).toString();

  if (markers?.length) {
    // требуется убрать время жизни, и хэш сумму на бек что там было принять решение актуальные у нас данные или нет
    cache.set(MARKERS_CACHE_KEY, markers, 1000 * 60 * 10); //? 10 минут кэширования маркеров;
    cache.set(MARKERS_HASH_CACHE_KEY, hash, 1000 * 60 * 10); //? 10 минут кэширования маркеров;
  }

  return {
    markers,
    hash,
  };
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
