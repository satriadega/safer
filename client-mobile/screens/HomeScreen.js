import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import Maps from "../components/Maps";
import { View } from "react-native";
import SearchBar from "../components/SearchBar";
import { useRef } from "react";

export default function HomeScreen() {
  const mapRef = useRef(null);

  const moveToLocation = async (latitude, longitude) => {
    mapRef?.current?.animateToRegion(
      {
        latitude,
        longitude,
        latitudeDelta: 0.015,
        longitudeDelta: 0.0121,
      },
      2000
    );
  };
  return (
    <View>
      <SearchBar mapRef={mapRef} moveToLocation={moveToLocation} />
      <Maps mapRef={mapRef} />
    </View>
  );
}
