import collection_map from "../../config/collection_names.json";
import catigoriesData from "../../config/categories.json";
import { fetchEvent, fetchMarkers, fetchSearchEvent } from "~/api/api.client";
import { useTransition as useNavTransition } from "@remix-run/react";
import dayjs from "dayjs";

import {
  useIsRestoring,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useCallback, useEffect, useState, useTransition } from "react";
import { Spin } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Header from "../Header/Header";
import { ClientOnly } from "remix-utils";
import LeafletMap from "../LeafletMap/LeafletMap.client";
import FloatingActions from "../FloatingActions/FloatingActions.client";

const all_catigories = catigoriesData.all_catigories;

function MapLayout() {
  const [map, setMap] = useState(null);

  const [markerList, setMarkerList] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [isPending, startTransition] = useTransition();
  const [isSearchClicked, setIsSearchClicked] = useState(false);
  const [filters, setFilters] = useState(null);
  const navTransition = useNavTransition();
  const [userPosition, setUserPosition] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  const { i18n } = useTranslation();

  const queryClient = useQueryClient();
  const isRestoring = useIsRestoring();

  const { isLoading: isMarkersLoading, data } = useQuery(
    ["markers"],
    fetchMarkers,
    {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 10,
      cacheTime: 1000 * 60 * 10,
    }
  );

  useEffect(() => {
    if (map?.zoomControl?._container) {
      let testPath = new RegExp(`^/${i18n.resolvedLanguage}/?$`).test(
        location.pathname
      );
      map.zoomControl._container.style.visibility = testPath
        ? "initial"
        : "hidden";
    }
  }, [location, i18n, map]);

  const { isFetching: isModalLoading, data: eventData } = useQuery(
    ["events", selectedMarker?.collection, selectedMarker?.id],
    async () =>
      await fetchEvent({
        ...selectedMarker,
        collection: collection_map.all_collections[selectedMarker.collection],
      }),
    {
      enabled: !!selectedMarker && !isRestoring,
      staleTime: 1000 * 60 * 5,
    }
  );

  const { data: searchData, isFetching: isSearchLoading } = useQuery(
    ["event_search", searchText],
    async () =>
      searchText ? await fetchSearchEvent({ text: searchText }) : [],
    {
      cacheTime: 0,
      staleTime: 0,
      enabled: !!isSearchClicked,
    }
  );

  useEffect(() => {
    setIsSearchClicked(false);
  }, [searchData]);

  useEffect(() => {
    if (eventData) {
      navigate(
        `/${i18n.resolvedLanguage}/index/${selectedMarker?.collection}/${eventData?.slug}`
      );
      setSelectedMarker(null);
    }
  }, [eventData, i18n.resolvedLanguage, navigate, queryClient, selectedMarker]);

  useEffect(() => {
    startTransition(() => {
      if (data?.length) {
        let filtered_data = data.slice();
        // поиск по фильтрам
        if (filters) {
          if (filters?.private) {
            filtered_data = filtered_data.filter((el) => el?.[0] === "tr");
          } else {
            let analogs_set =
              filters.categories
                ?.map((key) => all_catigories[key].list_analogs)
                ?.reduce((prev, cur) => prev.concat(cur), []) ?? [];

            // нормализация по дате + категориям
            filtered_data = filtered_data
              .filter((marker) => {
                if (!Array.isArray(marker?.[0])) {
                  return false;
                }

                return !!marker[0].find(
                  (categorie) =>
                    !!analogs_set.find((analog) => categorie.includes(analog))
                );
              })
              .filter((marker) => {
                if (!filters?.dates) {
                  return true;
                }

                let startDays = marker?.[1];
                let endDays = marker?.[2];

                if (!startDays?.length || !endDays?.length) {
                  // ? включать все маркеры, у кторых нет дат
                  return true;
                }

                startDays =
                  typeof startDays === "string"
                    ? [dayjs(startDays)]
                    : Array.isArray(startDays)
                    ? startDays.map(dayjs)
                    : null;
                endDays =
                  typeof endDays === "string"
                    ? [dayjs(endDays)]
                    : Array.isArray(endDays)
                    ? endDays.map(dayjs)
                    : null;

                if (!endDays || !startDays) {
                  return true;
                }

                let atleastOneStartBeforeEnd = startDays.find((date) => {
                  return filters.dates[0].isSameOrBefore(date);
                });
                let atleastOneEndAfterStart = startDays.find((date) => {
                  return filters.dates[1].isSameOrAfter(date);
                });

                return !!atleastOneEndAfterStart && !!atleastOneStartBeforeEnd;
              });
          }
        }

        // поиск по тексту
        if (searchText) {
          if (searchData?.length) {
            let searchDataSet = new Set(searchData);
            filtered_data = filtered_data.filter((el) =>
              searchDataSet.has(el[3])
            );
          } else {
            filtered_data = [];
          }
        }

        setMarkerList(filtered_data);
      }
    });
  }, [data, searchData, searchText, filters]);

  const markerClickHandler = useCallback((e, obj) => {
    setSelectedMarker(obj);
  }, []);

  const handleSearch = useCallback((value, e) => {
    setSearchText(value);
    setIsSearchClicked(true);
  }, []);

  const handleApplyFilters = useCallback((obj) => {
    setFilters(obj);
  }, []);

  const markersLoading = [
    navTransition.submission,
    isMarkersLoading,
    isPending,
  ].some((el) => !!el);

  const loading = [
    markersLoading,
    isModalLoading,
    isRestoring,
    isSearchLoading,
  ].some((el) => !!el);

  return (
    <>
      <div className="map">
        <Spin spinning={loading} className="spinner" size="large">
          <div className="map">
            <ClientOnly>
              {() => (
                <LeafletMap
                  userPosition={userPosition}
                  setMap={setMap}
                  markerList={markerList}
                  markerClickHandler={markerClickHandler}
                />
              )}
            </ClientOnly>
          </div>
        </Spin>
      </div>
      <Header
        handleSearch={handleSearch}
        filters={filters}
        handleApplyFilters={handleApplyFilters}
      />
      <ClientOnly>
        {() => (
          <FloatingActions
            loading={loading}
            map={map}
            setUserPosition={setUserPosition}
          />
        )}
      </ClientOnly>
    </>
  );
}

export default MapLayout;
