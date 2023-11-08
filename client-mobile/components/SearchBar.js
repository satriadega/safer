import React, { useRef } from "react";
import { StyleSheet, View } from "react-native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
// import { GOOGLE_API_KEY } from "@env";
import Constants from "expo-constants";

// export default function SearchBar() {
//   const [value, setValue] = useState("")

export default function SearchBar({ mapRef }) {
  return (
    <View style={styles.container}>
      <GooglePlacesAutocomplete
        fetchDetails={true}
        placeholder="Search"
        onPress={(data, details = null) => {
          console.log(JSON.stringify(details?.geometry?.location));
          mapRef?.current?.animateToRegion(
            {
              latitude: details?.geometry?.location.lat,
              longitude: details?.geometry?.location.lng,
              latitudeDelta: 0.025,
              longitudeDelta: 0.025,
            },
            2000
          );
        }}
        query={{
          key: process.env.GOOGLE_API_KEY,
          language: "en",
        }}
        onFail={(error) => console.log(error)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    zIndex: 1,
    position: "absolute",
    width: "100%",
    marginVertical: 10,
    paddingHorizontal: 20,
    top: Constants.statusBarHeight,
  },
  input: {
    padding: 10,
  },
});
