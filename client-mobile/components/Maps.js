import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, View, TouchableOpacity, Text } from "react-native";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import MarkerPin from "./MarkerPin";
import { useNavigation } from "@react-navigation/native";
import * as Location from "expo-location";
import Loading from "../components/Loading";
import Popover from "../components/Popover";
import { Dimensions } from "react-native";

export default function Maps({ mapRef }) {
  const navigation = useNavigation();
  const windowWidth = Dimensions.get("window").width;
  const windowHeight = Dimensions.get("window").height;

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    map: {
      height: "100%",
      width: "100%",
    },
  });

  mapStyle = [
    {
      featureType: "all",
      stylers: [
        {
          saturation: 0,
        },
        {
          hue: "#e7ecf0",
        },
      ],
    },
    {
      featureType: "road",
      stylers: [
        {
          saturation: -70,
        },
      ],
    },
    {
      featureType: "transit",
      stylers: [
        {
          visibility: "off",
        },
      ],
    },
    {
      featureType: "poi",
      stylers: [
        {
          visibility: "off",
        },
      ],
    },
    {
      featureType: "water",
      stylers: [
        {
          visibility: "simplified",
        },
        {
          saturation: -60,
        },
      ],
    },
  ];

  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMSg] = useState("");

  useEffect(() => {
    const getPermissions = async () => {
      setLoading(true);
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        console.log(status);
        let currentLocation = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Low,
        });
        setLocation(currentLocation);
        setLoading(false);
      } catch (err) {
        console.log(err);
        setLocation({
          coords: {
            accuracy: 100,
            altitude: 49.70000076293945,
            altitudeAccuracy: 33.497474670410156,
            heading: 0,
            latitude: -6.2925119,
            longitude: 106.6757232,
            speed: 0,
          },
          mocked: false,
          timestamp: 1699444421703,
        });
        setLoading(false);
      }
    };
    getPermissions();
    setLoading(false);
  }, []);

  // jika errMsg nya true return text error

  return (
    <View style>
      {loading ? (
        <View style={{ height: "100%" }}>
          <Loading />
        </View>
      ) : (
        <>
          <MapView
            ref={mapRef}
            style={styles.map}
            customMapStyle={mapStyle}
            provider={PROVIDER_GOOGLE}
            onLongPress={(e) => {
              navigation.navigate("Add-Report", {
                coordinate: e.nativeEvent.coordinate,
              });
            }}
            camera={{
              center: {
                latitude: location?.coords?.latitude,
                longitude: location?.coords?.longitude,
              },
              pitch: 0,
              heading: 0,
              zoom: 15,
            }}
            showsUserLocation={true}
            showsMyLocationButton={true}
            minZoomLevel={7}
            maxZoomLevel={18}
            // mapPadding={{ bottom: 100, right: 10, left: 13 }} //ios
            mapPadding={{ top: 80, right: 10, left: 13 }} //android
          >
            <MarkerPin />
          </MapView>
          <Popover />
        </>
      )}
    </View>
  );
}
