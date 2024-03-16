import React from "react";
import {
  Image,
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";

const { height } = Dimensions.get("screen");

export default function ReportCard({ id, onPress, data }) {
  return (
    <TouchableOpacity onPress={() => onPress(id)}>
      <View style={styles.container}>
        <View style={{ flex: 1 }}>
          <Image
            style={styles.image}
            source={{
              uri: data?.mainImage || "https://via.placeholder.com/150",
            }}
          />
        </View>
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontSize: 20,
              fontWeight: "bold",
              color: "#333333",
              marginBottom: 8,
            }}
          >
            {data?.title}
          </Text>
          <Text style={{ color: "grey" }}>{data?.Type.name}</Text>
          <Text style={{ paddingVertical: 10 }} numberOfLines={2}>
            {data?.description}
          </Text>
          <Text>Reported By: {data?.User?.name || "User not found"}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    gap: 10,
    padding: 12,
    borderRadius: 10,
    backgroundColor: "#fff",
    elevation: 4,
    marginHorizontal: 10,
    marginVertical: 10,
  },

  image: {
    width: "100",
    height: 150,
    borderRadius: 10,
    objectFit: "cover",
  },
});
