import Popover from "react-native-popover-view";
import { Entypo } from "@expo/vector-icons";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function PopOver() {
  return (
    <View style={{ position: "absolute", bottom: 120, left: 30 }}>
      <Popover
        arrowShift={0}
        verticalOffset={1}
        placement="auto"
        from={
          <TouchableOpacity>
            <Entypo name="info-with-circle" size={30} color="#015C92" />
          </TouchableOpacity>
        }
      >
        <View style={{ display: "flex", gap: 12, padding: 12 }}>
          <View style={{ display: "flex", flexDirection: "row", gap: 10 }}>
            <Image
              style={styles.image}
              source={{
                uri: "https://cdn-icons-png.flaticon.com/512/4643/4643191.png",
              }}
            />
            <Text style={styles.text}>Bencana</Text>
          </View>
          <View style={{ display: "flex", flexDirection: "row", gap: 10 }}>
            <Image
              style={styles.image}
              source={{
                uri: "https://cdn-icons-png.flaticon.com/512/9439/9439134.png",
              }}
            />
            <Text style={styles.text}>Kejahatan</Text>
          </View>
          <View style={{ display: "flex", flexDirection: "row", gap: 10 }}>
            <Image
              style={styles.image}
              source={{
                uri: "https://cdn-icons-png.flaticon.com/512/4891/4891530.png",
              }}
            />
            <Text style={styles.text}>Kecelakaan</Text>
          </View>
        </View>
      </Popover>
    </View>
  );
}

const styles = StyleSheet.create({
  image: { height: 30, width: 30 },
  text: {
    textAlignVertical: "center",
    fontWeight: "500",
    fontSize: 16,
    paddingLeft: 10,
  },
});
