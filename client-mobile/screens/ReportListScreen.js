import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
  TextInput,
  TouchableOpacity,
} from "react-native";
import ReportCard from "../components/ReportCard";
import { gql, useQuery } from "@apollo/client";
import { GET_REPORTS, GET_TYPES } from "../config/queries";
import Loading from "../components/Loading";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import { Feather } from "@expo/vector-icons";

export default function ReportListScreen({ navigation }) {
  const {
    loading: loadingType,
    error: errorType,
    data: types,
  } = useQuery(GET_TYPES);
  const {
    loading: loadingReport,
    error: errorReport,
    data: reports,
  } = useQuery(GET_REPORTS);

  const [filter, setfilter] = useState("");
  const [search, setSearch] = useState("");

  const filteredData = reports?.reports.filter(
    (item) => item.Type.name.toLowerCase() === filter.toLowerCase() || !filter
  );

  const finalFilterData = filteredData?.filter(
    (item) => item.title.toLowerCase().includes(search.toLowerCase()) || !search
  );

  const handleCardPress = (id) => {
    navigation.navigate("Report-Details", {
      id,
    });
  };

  const clearInput = () => {
    setSearch("");
  };

  if (loadingReport) return <Loading />;

  return (
    <>
      <View
        style={{
          paddingTop: 24,
          paddingHorizontal: 24,
          width: "100%",
          backgroundColor: "#f0f6fa",
          borderBottomRightRadius: 30,
          borderBottomLeftRadius: 30,
          position: "absolute",
          zIndex: 1,
          elevation: 4,
        }}
      >
        <Text style={styles.header}>Recent Reports</Text>
        <View>
          <TextInput
            style={styles.search}
            placeholder="Search"
            value={search}
            onChangeText={setSearch}
            clearButtonMode="while-editing" // This is the property for Android
          />
          {search !== "" && (
            <TouchableOpacity onPress={clearInput} style={styles.clearButton}>
              <Feather name="x-circle" size={20} color="grey" />
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.filter}>
          <Pressable // FILTER ALL
            style={({ pressed }) => [
              styles.filterButton,
              {
                backgroundColor:
                  filter === "" ? "#088395" : pressed ? "#088395" : "#fff",
              },
            ]}
            onPress={() => setfilter("")}
          >
            <Text
              style={[
                styles.filterText,
                { color: filter === "" ? "#fff" : "#000" },
              ]}
            >
              All
            </Text>
          </Pressable>
          <Pressable // FILTER BENCANA
            style={({ pressed }) => [
              styles.filterButton,
              {
                backgroundColor:
                  filter === "Bencana"
                    ? "#088395"
                    : pressed
                    ? "#088395"
                    : "#fff",
              },
            ]}
            onPress={() => setfilter("Bencana")}
          >
            <Text
              style={[
                styles.filterText,
                { color: filter === "Bencana" ? "#fff" : "#000" },
              ]}
            >
              Bencana
            </Text>
          </Pressable>
          <Pressable // FILTER KEJAHATAN
            style={({ pressed }) => [
              styles.filterButton,
              {
                backgroundColor:
                  filter === "Kejahatan"
                    ? "#088395"
                    : pressed
                    ? "#088395"
                    : "#fff",
              },
            ]}
            onPress={() => setfilter("Kejahatan")}
          >
            <Text
              style={[
                styles.filterText,
                { color: filter === "Kejahatan" ? "#fff" : "#000" },
              ]}
            >
              Kejahatan
            </Text>
          </Pressable>
          <Pressable // FILTER KECELAKAAN
            style={({ pressed }) => [
              styles.filterButton,
              {
                backgroundColor:
                  filter === "Kecelakaan"
                    ? "#088395"
                    : pressed
                    ? "#088395"
                    : "#fff",
              },
            ]}
            onPress={() => setfilter("Kecelakaan")}
          >
            <Text
              style={[
                styles.filterText,
                { color: filter === "Kecelakaan" ? "#fff" : "#000" },
              ]}
            >
              Kecelakaan
            </Text>
          </Pressable>
        </View>
      </View>
      <SafeAreaView style={styles.container}>
        <ScrollView
          style={{ flex: 1, padding: 12 }}
          keyboardShouldPersistTaps="handled"
        >
          {finalFilterData?.map((report) => (
            <ReportCard
              data={report}
              reportId={report.id}
              onPress={() => handleCardPress(report.id)}
              key={report.id}
            />
          ))}
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 170,
    marginBottom: 90,
    paddingHorizontal: 10,
  },
  header: {
    paddingTop: 12,
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
  },
  filter: {
    display: "flex",
    flexDirection: "row",
    gap: 19,
    marginBottom: 20,
    justifyContent: "center",
  },
  filterButton: {
    backgroundColor: "#fff",
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 10,
    elevation: 2,
    margin: 1,
  },
  filterText: {
    fontSize: 14,
    fontWeight: "700",
  },
  search: {
    backgroundColor: "#fff",
    borderRadius: 10,
    marginVertical: 20,
    marginHorizontal: 10,
    paddingLeft: 15,
    paddingRight: 45,
    paddingVertical: 10,
    fontSize: 16,
    elevation: 4,
  },
  clearButton: {
    position: "absolute",
    left: 300,
    top: 35,
  },
});
