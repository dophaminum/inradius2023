import L from "leaflet";
import { useEffect, useRef } from "react";
import { useMap } from "react-leaflet";
import "leaflet.markercluster";
import { getCategoryIcon } from "~/utils/client/index.client";

const MarkerCluster = ({ markers, markerClickHandler }) => {
  const mcg = useRef(null);
  const map = useMap();

  useEffect(() => {
    if (!mcg.current) {
      mcg.current = L.markerClusterGroup({
        // chunkedLoading: true,
        showCoverageOnHover: true,
      });
    }

    mcg.current.clearLayers();
    if (markers?.length) {
      const markerList = markers.map((el) => {
        const markerIco = getCategoryIcon(el?.[0]);
        const marker = L.marker(new L.LatLng(el[4], el[5]), {
          icon: markerIco,
          title: el[3],
        });

        marker.on("click", (e) =>
          markerClickHandler(e, { id: el[3], collection: el[6] })
        );
        return marker;
      });

      mcg.current.addLayers(markerList);
      map.fitBounds(mcg.current.getBounds());
      map.addLayer(mcg.current);
    }
  }, [markers, map, markerClickHandler]);

  return null;
};

export default MarkerCluster;
