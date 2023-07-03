import Attractions from "~/assets/Attractions.svg";
import Beauty from "~/assets/Beauty.svg";
import Business from "~/assets/Business.svg";
import Cinema from "~/assets/Cinema.svg";
import Education from "~/assets/Education.svg";
import Exhibition from "~/assets/Exhibition.svg";
import Festival from "~/assets/Festival.svg";
import Food from "~/assets/Food.svg";
import For_kids from "~/assets/For kids.svg";
import Games from "~/assets/Games.svg";
import Languages from "~/assets/Languages.svg";
import Markets from "~/assets/Markets.svg";
import MasterClasses from "~/assets/MasterClasses.svg";
import Party from "~/assets/Party.svg";
import Psychology from "~/assets/Psychology.svg";
import Science from "~/assets/Science.svg";
import Sport from "~/assets/Sport.svg";
import Theater_Concert from "~/assets/Theater&Concert.svg";
import Tour from "~/assets/Tour.svg";
import Private_Tours from "~/assets/Private Tours.svg";
import Others from "~/assets/Other.svg";

import default_ico from "~/assets/location.svg";
import categories from "~/config/categories.json";
import L from "leaflet";

const all_catigories = categories.all_catigories;

export function getCategoryIcon(category) {
  let catigories_map = Object.values(all_catigories);

  let category_name = Array.isArray(category)
    ? catigories_map?.find((ctg) =>
        category.find((el) => ctg.list_analogs.includes(el))
      )?.category_EN
    : category === "tr"
    ? categories?.private_catigorie?.category_EN
    : null;

  let iconUrl;
  let iconSize = new L.Point(40, 50);
  iconSize = iconSize.multiplyBy(0.75);

  switch (category_name) {
    case "Private Tours":
      iconUrl = Private_Tours;
      break;
    case "Attractions":
      iconUrl = Attractions;
      break;
    case "Theater & Concert":
      iconUrl = Theater_Concert;
      break;
    case "For Kids":
      iconUrl = For_kids;
      break;
    case "Sport":
      iconUrl = Sport;
      break;
    case "Food":
      iconUrl = Food;
      break;
    case "Psychology":
      iconUrl = Psychology;
      break;
    case "Games":
      iconUrl = Games;
      break;
    case "MasterClasses":
      iconUrl = MasterClasses;
      break;
    case "Education":
      iconUrl = Education;
      break;
    case "Exhibition":
      iconUrl = Exhibition;
      break;
    case "Tour":
      iconUrl = Tour;
      break;
    case "Festival":
      iconUrl = Festival;
      break;
    case "Cinema":
      iconUrl = Cinema;
      break;
    case "Markets":
      iconUrl = Markets;
      break;
    case "Party":
      iconUrl = Party;
      break;
    case "Business":
      iconUrl = Business;
      break;
    case "Languages":
      iconUrl = Languages;
      break;
    case "Beauty":
      iconUrl = Beauty;
      break;
    case "Science":
      iconUrl = Science;
      break;
    case "Others":
      iconUrl = Others;
      break;
    default:
      iconUrl = default_ico;
      
      break;
  }

  return new L.Icon({
    iconUrl,
    iconSize,
  });
}
