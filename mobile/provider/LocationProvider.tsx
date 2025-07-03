import * as Location from "expo-location";
import { createContext, useContext, useEffect, useState } from "react";
import { Alert } from "react-native";

interface LocationContextType {
  location: Location.LocationObject | null;
  errorMsg: string | null;
  regionName: string | null;
}
export const LocationContext = createContext<LocationContextType | undefined>(
  undefined
);

export function LocationProvider({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );
  const [regionName, setRegionName] = useState<string | null>(null);
  const [geocodeResult, setGeocodeResult] = useState<
    Location.LocationGeocodedAddress[] | null
  >(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    requestLocationPermission();
  }, []);

  const requestLocationPermission = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setErrorMsg("Permission to access location was denied");
      Alert.alert(
        "Location Permission Denied",
        "Please enable location services in your device settings.",
        [{ text: "ok", style: "default" }]
      );
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    let geocode = await Location.reverseGeocodeAsync({
      latitude: location?.coords?.latitude,
      longitude: location?.coords?.longitude,
    }).catch((error) => {
      console.error("Geocode Error:", error);
      setErrorMsg("Failed to retrieve location information");
      return [];
    });
    setLocation(location);
    setGeocodeResult(geocode);
    setRegionName(geocode[0]?.name || null);
  };
  return (
    <LocationContext.Provider
      value={{
        location,
        errorMsg,
        regionName: regionName || geocodeResult?.[0]?.city || null,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
}

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error("useLocation must be used within a LocationProvider");
  }
  return context;
};
