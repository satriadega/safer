import React, { useRef, useState } from "react";
import { Image, StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { Marker } from "react-native-maps";
import { useQuery } from "@apollo/client";
import { GET_REPORTS } from "../config/queries";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useNavigation } from "@react-navigation/native";

const imagesUri = {
  Bencana: "https://cdn-icons-png.flaticon.com/512/4643/4643191.png",
  Kejahatan: "https://cdn-icons-png.flaticon.com/512/9439/9439134.png",
  Kecelakaan: "https://cdn-icons-png.flaticon.com/512/4891/4891530.png",
};

export default function MarkerPin() {
  const navigation = useNavigation();
  const [selectedReport, setSelectedReport] = useState(null);
  const snapPoints = ["28%", "50%"];

  const { loading, error, data } = useQuery(GET_REPORTS);
  console.log(selectedReport, "<><><><>");

  if (loading) return null;
  if (error) return null;

  const reports = data.reports;

  const bottomSheetModalRef = useRef();

  const handlePresentModal = (report) => {
    setSelectedReport(report);
    bottomSheetModalRef.current?.present();
  };

  const handleCardPress = (id) => {
    navigation.navigate("Report-Details", { id });
    bottomSheetModalRef.current?.close();
  };

  return (
    <View>
      {reports.map((report) => (
        <Marker
          onPress={() => handlePresentModal(report)}
          key={+report.id}
          coordinate={{
            latitude: +report.latitude,
            longitude: +report.longitude,
          }}
        >
          <View style={styles.container}>
            <Image
              style={styles.iconType}
              source={{
                uri: imagesUri[report.Type.name],
              }}
            />
          </View>
        </Marker>
      ))}

      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={1}
        snapPoints={snapPoints}
        backgroundStyle={{ borderRadius: 30 }}
      >
        {selectedReport && (
          <View style={styles.contentContainer}>
            <View style={styles.headerSheet}>
              <Text style={styles.title}>{selectedReport.title}</Text>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  gap: 10,
                  alignItems: "center",
                  backgroundColor: "#088395",
                  padding: 12,
                  borderRadius: 30,
                }}
              >
                <Image
                  style={styles.iconType}
                  source={{
                    uri: imagesUri[selectedReport.Type.name],
                  }}
                />
                <Text style={styles.type}>{selectedReport.Type.name}</Text>
              </View>
            </View>
            <View style={{ display: "flex", alignItems: "center" }}>
              <Image
                style={styles.image}
                source={{
                  uri:
                    selectedReport.mainImage ||
                    "https://via.placeholder.com/150",
                }}
              />
            </View>

            <TouchableOpacity
              onPress={() => handleCardPress(selectedReport.id)}
              style={{
                backgroundColor: "#015C92",
                padding: 12,
                borderRadius: 30,
              }}
            >
              <Text
                style={{
                  textAlign: "center",
                  fontSize: 20,
                  fontWeight: "700",
                  color: "white",
                }}
              >
                See Details
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </BottomSheetModal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  iconType: {
    height: 30,
    width: 30,
    borderRadius: 2,
  },
  contentContainer: {
    flex: 1,
    textAlign: "center",
    paddingVertical: 12,
    paddingHorizontal: 15,
    marginHorizontal: 12,
  },
  image: {
    width: "60%",
    height: 200,
    borderRadius: 10,
    objectFit: "cover",
    borderWidth: 1,
    borderColor: "#088395",
    marginBottom: 30,
  },

  title: {
    fontWeight: "700",
    fontSize: 18,
    textAlign: "center",
  },
  type: {
    fontWeight: "500",
    fontSize: 16,
    textAlign: "center",
    justifyContent: "center",
    color: "#fff",
  },
  description: {
    fontSize: 18,
  },
  headerSheet: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    alignItems: "center",
  },
});
