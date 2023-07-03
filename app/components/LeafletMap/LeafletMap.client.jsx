import { Circle, MapContainer, Marker, TileLayer } from "react-leaflet";
import MarkerCluster from "~/lib/react-leaflet-markercluster.client";
import L from "leaflet";
import UserPosition from "~/assets/user_location.svg";

const user_position_ico = new L.icon({
  iconUrl: UserPosition,
  iconSize: new L.Point(40, 40),
});

const initial_position = [38.9637, 35.2433];

function LeafletMap({ markerList, setMap, markerClickHandler, userPosition }) {
  return (
    <>
      <MapContainer
        center={initial_position}
        zoom={4}
        scrollWheelZoom={true}
        className="map__container"
        ref={setMap}
      >
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MarkerCluster
          markers={markerList}
          markerClickHandler={markerClickHandler}
        />
        {userPosition && (
          <>
            <Marker
              position={{ lat: userPosition.lat, lng: userPosition.lng }}
              icon={user_position_ico}
              zIndexOffset={999}
            />
          </>
        )}
      </MapContainer>
    </>
  );
}

export default LeafletMap;
