import MapHostel from "@/components/MapHostel";
import CustomSearchBar from "@/components/SearchBar";
import { icons } from "@/constants";
import { customMapStyle, hostelsDataMarker } from "@/constants/map";
import { calculateDistance, calculateRegion } from "@/lib/map";
import { useLocation } from "@/provider/LocationProvider";
import React from "react";
import { FlatList, StyleSheet, View } from "react-native";
import MapView, { Circle, Marker, PROVIDER_DEFAULT } from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";
import { hostels } from ".";

const Explore = () => {
  const { location } = useLocation();
  const [SelectedHostel, setSelectedHostel] = React.useState(null);
  const regions = calculateRegion({
    userLatitude: location?.coords?.latitude || null,
    userLongitude: location?.coords?.longitude || null,
  });
  const [search, setSearch] = React.useState("");
  const PROXIMITY_RADIUS = 680;

  return (
    <SafeAreaView className="flex-1">
      <View className="absolute top-0 left-0 right-0 z-10 px-4 py-2">
        <CustomSearchBar search={search} setSearch={setSearch} />
      </View>
      <MapView
        style={StyleSheet.absoluteFill}
        provider={PROVIDER_DEFAULT}
        showsUserLocation={false}
        initialRegion={regions}
        loadingEnabled={true}
        showsPointsOfInterest={false}
        showsBuildings={false}
        customMapStyle={customMapStyle}
        initialCamera={{
          center: {
            latitude: location?.coords?.latitude!,
            longitude: location?.coords?.longitude!,
          },
          pitch: 0,
          heading: 0,
          altitude: 1000,
          zoom: 15,
        }}
        showsMyLocationButton={true}
      >
        {hostelsDataMarker.map((hostel) => {
          const hostelCoords = {
            latitude: hostel.location.lat,
            longitude: hostel.location.lng,
          };
          let markerIcon = icons.dot;

          if (location && location.coords) {
            const userCoords = {
              latitude: location?.coords?.latitude,
              longitude: location?.coords?.longitude,
            };
            const distance = calculateDistance(userCoords, hostelCoords);

            if (distance > PROXIMITY_RADIUS) {
              markerIcon = icons.dot;
            }
          }
          return (
            <Marker
              key={hostel.id}
              coordinate={hostelCoords}
              title={hostel.name}
              image={markerIcon}
              anchor={{ x: 0.5, y: 0.5 }}
            />
          );
        })}
        {location && (
          <Marker
            draggable
            coordinate={{
              latitude: location?.coords?.latitude,
              longitude: location?.coords?.longitude,
            }}
            title="Your Location"
            image={icons.user}
            anchor={{ x: 0.5, y: 0.5 }}
          />
        )}
        <Circle
          center={{
            latitude: location?.coords?.latitude!,
            longitude: location?.coords?.longitude!,
          }}
          radius={PROXIMITY_RADIUS}
          strokeWidth={2}
          strokeColor="#0c45ad"
          fillColor="#dae3f2"
        />
      </MapView>
      <View className="absolute bottom-10 left-0 right-0 z-10 px-4 py-2">
        <View className="flex-row gap-4 flex-wrap">
          <FlatList
            horizontal
            contentContainerStyle={{
              paddingVertical: 15,
              gap: 5,
            }}
            showsHorizontalScrollIndicator={false}
            data={hostels.filter((hostel) =>
              hostel.name.toLowerCase().includes(search.toLowerCase())
            )}
            renderItem={({ item }) => (
              <MapHostel
                key={item.id}
                item={{
                  ...item,
                  onPress: () => console.log(`Selected ${item.name}`),
                }}
              />
            )}
            keyExtractor={(item) => item.id}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Explore;
