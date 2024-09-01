import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import socket from "../../utils/socket";
import "leaflet-routing-machine";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";

// Custom hook to handle route updates
const RoutingControl = ({ userLocation, storeLocation }) => {
  const map = useMap();

  useEffect(() => {
    if (userLocation && storeLocation) {
      const routingControl = L.Routing.control({
        waypoints: [
          L.latLng(userLocation[0], userLocation[1]),
          L.latLng(storeLocation[0], storeLocation[1]),
        ],
        routeWhileDragging: true,
      }).addTo(map);

      return () => {
        map.removeControl(routingControl);
      };
    }
  }, [userLocation, storeLocation, map]);

  return null;
};

const Map = () => {
  const { placeName } = useParams();
  const [userLocation, setUserLocation] = useState(null);
  const [storeLocation, setStoreLocation] = useState(null);

  useEffect(() => {
    // Fetch the store location
    const fetchStoreLocation = async () => {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
            placeName
          )}&format=json&limit=1`
        );
        const data = await response.json();
        if (data.length > 0) {
          const { lat, lon } = data[0];
          setStoreLocation([parseFloat(lat), parseFloat(lon)]);
        } else {
          console.error("Store not found");
          alert("Store not found");
        }
      } catch (error) {
        console.error("Error fetching store location: ", error);
        alert("Error fetching store location");
      }
    };

    fetchStoreLocation();

    // Handle geolocation
    const handleGeolocation = (position) => {
      const { latitude, longitude } = position.coords;
      setUserLocation([latitude, longitude]);
      socket.emit("locationUpdate", { lat: latitude, lon: longitude });
    };

    const handleError = (error) => {
      console.error("Error getting location:", error);
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(handleGeolocation, handleError, {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      });
    } else {
      console.error("Geolocation is not supported by this browser.");
    }

    // Socket event listeners
    const handleLocationUpdate = (location) => {
      console.log("Received location update:", location);

      // Update user location based on incoming socket data
      // Check if location object contains lat and lon
      if (location.lat && location.lon) {
        setUserLocation([location.lat, location.lon]);
      }
    };

    // Attach socket event listener
    socket.on("locationUpdate", handleLocationUpdate);

    // Cleanup on unmount
    return () => {
      socket.off("locationUpdate", handleLocationUpdate);
    };
  }, [placeName]);

  // Update map center when user location is available
  const mapCenter = userLocation || [51.505, -0.09];

  return (
    <div>
      <MapContainer
        style={{ height: "calc(100vh - 80px)", width: "100%" }}
        center={mapCenter}
        zoom={20}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {storeLocation && (
          <Marker position={storeLocation}>
            <Popup>Store Location</Popup>
          </Marker>
        )}
        {userLocation && (
          <Marker position={userLocation}>
            <Popup>Your Location</Popup>
          </Marker>
        )}
        <RoutingControl
          userLocation={userLocation}
          storeLocation={storeLocation}
        />
      </MapContainer>
    </div>
  );
};

export default Map;
