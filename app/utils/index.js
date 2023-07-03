import { unescape } from "html-escaper";
import { stripHtml } from "string-strip-html";
import _ from "lodash";
import dayjs from "dayjs";
import currencyToSymbolMap from "currency-symbol-map/map";
import categorie_list from "../config/categories.json";

const inversCurrencyToSymbolMap = _.invert(currencyToSymbolMap);
export function getCanonical(url, canonical_uri) {
  let pathname = new URL(url).pathname;

  return canonical_uri + pathname;
}

export function getAlternates(url, canonical_uri, langs = ["ru", "es", "en"]) {
  let links = langs.map((lang) => {
    let pathname = new URL(url).pathname;
    let regex = new RegExp(`^/.{2}`);

    return {
      hrefLang: lang,
      rel: "alternate",
      href: canonical_uri + pathname.replace(regex, `/${lang}`),
    };
  });

  return links?.length ? links : [];
}

// ? unused
// export function getMyLang(lang) {
//   const supported = ["en", "ru", "es"];
//   const default_lang = "en";
//   return !lang || !supported.includes(lang) ? default_lang : lang;
// }

function getCurrencyAndValue(price) {
  const inversCurrencyToSymbolMapKeys = Object.keys(inversCurrencyToSymbolMap);

  let currency_symbol = inversCurrencyToSymbolMapKeys.find((el) =>
    price.includes(el)
  );
  if (!currency_symbol && (price.includes("rub") || price.includes("руб"))) {
    currency_symbol = "₽";
  }

  const currency = inversCurrencyToSymbolMap[currency_symbol];
  const value = price.match(/[+-]?[0-9]+[.]?[0-9]*([e][+-]?[0-9]+)?/)?.[0];

  return {
    priceCurrency: currency,
    price: value?.length ? parseFloat(value) : null,
  };
}

function generateAddress(adresses = []) {
  adresses = adresses.filter((el) => el);
  return adresses?.length ? adresses.join(", ") : "";
}

function getZippedDates(starts = [], ends = []) {
  let combined = _.zip(starts, ends).map((el) => {
    return [dayjs(el[0]), dayjs(el[1])];
  });

  return combined;
}

function getTitleEndPhrase(analogs, title, city, locale) {
  if ((!analogs?.length && analogs !== "tr") || !city) {
    return title;
  }

  let result;
  if (analogs === "tr") {
    let phrase = getDataByKeyLocale(
      categorie_list.private_catigorie,
      "title_end_phrase_{$}",
      locale
    );
    if (phrase) {
      result = `${_.capitalize(city)} ${phrase}`;
    }
  } else if (Array.isArray(analogs)) {
    let catigorie_candidate = Object.keys(categorie_list.all_catigories).find(
      (ctg) => {
        let analogs_set = new Set(ctg.list_analogs);

        return !!analogs.find((el) => analogs_set.has(el));
      }
    );
    if (catigorie_candidate) {
      let phrase = getDataByKeyLocale(
        catigorie_candidate,
        "title_end_phrase_{$}",
        locale
      );
      if (phrase) {
        result = result = `${_.capitalize(city)} ${phrase}`;
      }
    }
  }

  return result ? `${result} ${title}` : title;
}

export function getDataByKeyLocale(
  obj,
  key,
  locale,
  prior = ["en", "_en", "", "ru", "_ru", "es", "_es"]
) {
  if (!obj || !key || !locale) return;

  const prefixes = ["", "re"];

  let obj_keys = Object.fromEntries(
    Object.keys(obj).map((el) => [[el.toLowerCase()], el])
  );

  locale = locale.toLowerCase();
  key = key.toLowerCase();

  if (locale === "ru") prior.unshift("");

  let finded_key = Object.keys(obj_keys).find((obj_key) => {
    return prefixes
      .map((pref) => pref + key.replace("{$}", locale))
      .includes(obj_key);
  });

  let result = obj[obj_keys[finded_key]];
  if (result) return result;

  const lower_keys = Object.keys(obj_keys);

  finded_key = prefixes
    .map((pref) => prior.map((lc) => pref + key.replace("{$}", lc)))
    ?.flat()
    ?.find((key) => lower_keys.includes(key));

  result = obj[obj_keys[finded_key]];

  return result;
}

export function normilizeEventData(data, locale) {
  if (!data) return;

  let result = {};

  let id = data?.id;
  if (id) {
    result.id = id;
  }

  let lat = data?.lat;
  let lon = data?.lon;
  if (lat && lon) {
    result.lat = lat;
    result.lon = lon;
  }

  let status = data?.status;
  if (status) {
    result.status = status;
  }

  let country = getDataByKeyLocale(data, "country{$}", locale);
  if (country) {
    result.country = country;
  }

  let organization = getDataByKeyLocale(data, "organization{$}", locale);
  if (organization?.length) {
    result.organization = organization;
  }

  // ? поддержка из других полей помимо "image" на всякий
  let image_core_attachment = data?.image_core_attachment ?? [];
  let img_uploadcare = data?.img_uploadcare ?? [];
  let images = getDataByKeyLocale(data, "images{$}", locale) ?? [];
  let image_array = [
    ...new Set([...image_core_attachment, ...img_uploadcare, ...images]),
  ];
  if (image_array?.length) {
    result.images = image_array;
  }

  let title = getDataByKeyLocale(data, "title{$}", locale);
  if (title) {
    result.title = _.capitalize(stripHtml(unescape(title)).result);
  }

  let summory = getDataByKeyLocale(data, "summory{$}", locale);
  if (summory) {
    result.summory = summory;
  }

  let description = getDataByKeyLocale(data, "description{$}", locale);
  if (description) {
    result.description = description;
  }

  let address = getDataByKeyLocale(data, "address{$}", locale);
  if (address) {
    result.address = address;
  }

  let meeting_point = getDataByKeyLocale(data, "meeting_point{$}", locale);
  if (meeting_point) {
    result.meeting_point = meeting_point;
  }

  let categories = getDataByKeyLocale(data, "categories{$}", locale);
  if (categories) {
    result.categories = categories;
  }

  // ! далее идет специфика

  //? нет в "tr" коллекции 😵
  let city = getDataByKeyLocale(data, "city{$}", locale);
  if (city) {
    result.city = city;
  }
  //? возможно нет в "tr" коллекции 👽
  let start_date = data?.start_date;
  if (start_date) {
    if (typeof start_date === "string") start_date = [start_date];
    result.start_date = start_date;
  }
  let end_date = data?.end_date;
  if (end_date) {
    if (typeof end_date === "string") end_date = [end_date];
    result.end_date = end_date;
  }

  //? возможно нет в "tr" коллекции 🤡
  let start_datetime = data?.start_dateT;
  if (start_datetime) {
    if (typeof start_datetime === "string") start_datetime = [start_datetime];
    result.start_datetime = start_datetime;
  }
  let end_datetime = data?.end_dateT;
  if (end_datetime) {
    if (typeof end_datetime === "string") end_datetime = [end_datetime];
    result.end_datetime = end_datetime;
  }

  //? "tr" =>

  let movement_type = data?.movement_type;
  if (movement_type) {
    result.movement_type = movement_type;
  }

  let max_persons = data?.max_persons;
  if (max_persons) {
    result.max_persons = max_persons;
  }

  let guide_avatar = data?.guide_avatar;
  if (guide_avatar) {
    result.guide_avatar = guide_avatar;
  }

  let price = getDataByKeyLocale(data, "price{$}", locale);
  if (price) {
    result.price = price;
  }

  let guide = getDataByKeyLocale(data, "guide{$}", locale);
  if (guide) {
    result.guide = guide;
  }

  let guide_description = getDataByKeyLocale(
    data,
    "guide_description{$}",
    locale
  );
  if (guide_description) {
    result.guide_description = guide_description;
  }

  return result;
}

export function getEventLDdata(data) {
  let eventStatus =
    (data?.status ?? "active") === "active"
      ? "https://schema.org/EventScheduled"
      : "https://schema.org/EventCancelled";

  let dates = getZippedDates(
    data?.start_date || data?.start_datetime,
    data?.end_date || data?.end_datetime
  );

  let result = {
    "@context": "https://schema.org",
    "@type": "Event",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus,
  };

  let images = data?.images;
  if (images?.length) {
    result.image = images;
  }

  let name = data?.title;
  if (name) {
    result.name = stripHtml(unescape(name)).result;
  }

  let description = data?.summory || data?.description;
  if (description) {
    result.description = stripHtml(unescape(description)).result;
  }

  let address = data?.address;
  let country = data?.country;
  let city = data?.city;
  let lat = data?.lat;
  let lon = data?.lon;
  if ((address || country || city || (lat && lon)) && result?.name) {
    let location = {
      "@type": "Place",
      name: result.name,
      address: generateAddress([address, city, country]),
    };

    if (lat && lon) {
      location.geo = {
        "@type": "GeoCoordinates",
        latitude: lat,
        longitude: lon,
      };
    }

    result.location = location;
  }

  //? max_persons
  let max_persons = data?.max_persons;
  if (max_persons) {
    result.maximumAttendeeCapacity = max_persons;
  }

  //? price
  let price_str = data?.price;
  if (price_str) {
    const { price, priceCurrency } = getCurrencyAndValue(price_str);

    if (priceCurrency || price) {
      let offers = {
        "@type": "Offer",
        // "url": "https://www.example.com/event_offer/12345_201803180430",
      };
      if (price) {
        offers.price = price;
      }
      if (price) {
        offers.priceCurrency = priceCurrency;
      }
      result.offers = offers;
    }
  }

  let guide_name = data?.guide;
  let guide_url = data?.guide_url;
  let guide_avatar = data?.guide_avatar;
  let guide_description = data?.guide_description;
  let organization = data?.organization;

  if (organization || guide_name) {
    let organizer;

    if (organization) {
      organizer = {
        "@type": "Organization",
        name: organization,
      };
    } else {
      organizer = {
        "@type": "Person",
        name: guide_name,
      };

      if (guide_url) {
        organizer.url = guide_url;
      }

      if (guide_avatar) {
        organizer.image = guide_avatar;
      }

      if (guide_description) {
        organizer.description = guide_description;
      }
    }

    if (organizer) {
      result.organizer = organizer;
    }
  }

  if (dates?.length) {
    dates = dates.map((el) => {
      const [start_date, end_date] = el;
      return [start_date.toISOString(), end_date.toISOString()];
    });

    const first = dates.shift();
    const [start_date, end_date] = first;

    result.startDate = start_date;
    result.endDate = end_date;

    if (dates?.length) {
      let subEvents = [];
      for (let date of dates) {
        let subEvent = {
          "@context": "https://schema.org",
          "@type": "Event",
          eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
          eventStatus,
          name: result.name,
          location: result.location,
        };

        const [start_date, end_date] = date;

        subEvent.startDate = start_date;
        subEvent.endDate = end_date;

        subEvents.push(subEvent);
      }
      result.subEvents = subEvents;
    }
  }

  return result;
}

export function getMetaData(data, locale) {
  let result = {};

  let images = data?.images;
  if (images?.length) {
    result.images = images.slice(0, 1);
  }

  let title = data?.title;
  if (title) {
    title = stripHtml(unescape(title)).result;
    if (
      (data?.categories?.length || typeof data?.categories === "string") &&
      data.city
    ) {
      title = getTitleEndPhrase(data.categories, title, data.city, locale);
    }
    result.title = title;
  }

  let description = data?.summory || data?.description;
  if (description) {
    result.description = stripHtml(unescape(description)).result;
  }

  return result;
}

//todo ? костыльное решение
export function serializeFunction(func) {
  return func.toString();
}
//todo ? костыльное решение
export function derializeFunction(func) {
  // eslint-disable-next-line no-new-func
  return new Function("return " + func.toString())();
}
