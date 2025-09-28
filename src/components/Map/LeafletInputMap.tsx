import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { GeoSearchControl, OpenStreetMapProvider } from "leaflet-geosearch";
import "leaflet-geosearch/dist/geosearch.css";
import L from "leaflet";

const SearchControl = () => {
  const map = useMap();

  useEffect(() => {
    const provider = new OpenStreetMapProvider();

    // Fix for missing constructor typing
    const searchControl = new (GeoSearchControl as any)({
      provider,
      style: "bar",
      autoComplete: true,
      autoCompleteDelay: 250,
      showMarker: false,
      retainZoomLevel: false,
    });

    map.addControl(searchControl);

    // Correct cleanup function
    return () => {
      map.removeControl(searchControl);
    };
  }, [map]);

  return null;
};

const LocationMarker = ({
  onSelect,
}: {
  onSelect: (lat: number, lng: number) => void;
}) => {
  const [position, setPosition] = useState<L.LatLng | null>(null);

  useMapEvents({
    click(e) {
      setPosition(e.latlng);
      onSelect(e.latlng.lat, e.latlng.lng);
    },
  });

  return position === null ? null : <Marker position={position} />;
};

const LeafletInputMap = ({
  onSelect,
}: {
  onSelect: (lat: number, lng: number) => void;
}) => {
  return (
    <MapContainer
      center={[23.8103, 90.4125]}
      zoom={13}
      scrollWheelZoom={true}
      style={{ height: "400px", width: "100%" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <SearchControl />
      <LocationMarker onSelect={onSelect} />
    </MapContainer>
  );
};

export default LeafletInputMap;
