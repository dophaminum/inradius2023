process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

import config from "../../config.server";
import fetch from "node-fetch";

const { API_URL } = config;

export async function fetchEvent({ id, collection }) {
  const response = await fetch(API_URL + `collections/${collection}/${id}`);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  let event = (await response.json()).data;

  return event;
}
