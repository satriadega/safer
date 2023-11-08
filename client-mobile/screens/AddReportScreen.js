import { useFocusEffect, useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import {
  Text,
  TextInput,
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { gql, useMutation, useQuery } from "@apollo/client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Cloudinary from "./Cloudinary";
import { GET_REPORTS } from "../config/queries";

const GET_TYPES = gql`
  query GetTypes {
    types {
      id
      name
    }
  }
`;

const ADD_REPORT = gql`
  mutation Mutation($newReport: ReportInput!) {
    createReport(newReport: $newReport) {
      title
      description
      mainImage
      TypeId
      latitude
      longitude
      latitudeDelta
      longitudeDelta
    }
  }
`;

export default function AddReportScreen({ route }) {
  const { data } = useQuery(GET_TYPES);

  const [access_token, setAccessToken] = useState("");

  const navigation = useNavigation();
  const { coordinate } = route.params;

  const [title, setTitle] = useState("");
  const [image, setImage] = useState(null);
  const [description, setDescription] = useState("");
  const [typeId, setTypeId] = useState("");
  // const [location, setLocation] = useState("");

  const [funcCreateReport, { data: report, loading, error }] = useMutation(
    ADD_REPORT,
    {
      refetchQueries: [GET_REPORTS],
      context: {
        headers: {
          access_token: access_token,
        },
      },
      onCompleted: () => {
        navigation.navigate("Home");
      },
    }
  );

  const submitReport = () => {
    try {
      uploadCloudinary(image);
    } catch (err) {
      console.log(err, 55555);
    }
  };

  const funcAccessToken = async () => {
    try {
      setTypeId(data?.types[0]);
      const getAccessToken = await AsyncStorage.getItem("access_token");
      setAccessToken(getAccessToken);
    } catch (err) {
      console.log(err);
    }
  };

  const uploadCloudinary = async (photo) => {
    console.log(photo);
    let base64Img = photo;
    let apiUrl = "https://api.cloudinary.com/v1_1/dapqihnih/image/upload";
    let data = {
      file: base64Img,
      api_key: process.env.CLOUDINARY_API_KEY,
      upload_preset: "safer-app",
    };

    fetch(apiUrl, {
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    })
      .then(async (response) => {
        let data = await response.json();
        console.log(data.secure_url);

        const payload = {
          title,
          description,
          mainImage: data.secure_url,
          TypeId: parseInt(typeId),
          latitude: coordinate.latitude.toString(),
          longitude: coordinate.longitude.toString(),
        };

        funcCreateReport({
          variables: {
            newReport: payload,
          },
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useFocusEffect(
    React.useCallback(() => {
      funcAccessToken();
    }, [])
  );

  const toLogin = async () => {
    navigation.navigate("Login");
  };
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={{ flex: 1, padding: 12 }}>
        <View style={{ height: 80 }}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => {
              navigation.goBack();
            }}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
        </View>
        <View style={{ flex: 1, padding: 12 }}>
          {access_token ? (
            <React.Fragment>
              <Text style={styles.header}>New Report</Text>
              <TextInput
                style={styles.input}
                onChangeText={setTitle}
                value={title}
                placeholder="Title"
                placeholderTextColor="#000"
              />
              <TextInput
                style={styles.multilineInput}
                onChangeText={setDescription}
                value={description}
                multiline={true}
                numberOfLines={5}
                placeholder="Description"
                placeholderTextColor="#000"
              />
              <View
                style={{
                  overflow: "hidden",
                }}
              >
                <Picker
                  style={styles.input}
                  selectedValue={typeId}
                  onValueChange={(itemValue) => {
                    console.log(itemValue);
                    setTypeId(itemValue);
                  }}
                >
                  {data?.types.map((type) => (
                    <Picker.Item
                      key={type.id}
                      label={type.name}
                      value={type.id.toString()}
                      style={styles.input}
                    />
                  ))}
                </Picker>
              </View>
              <Cloudinary image={image} setImage={setImage} />
              <TouchableOpacity
                style={styles.submitButton}
                onPress={submitReport}
              >
                <Text
                  style={{ color: "#fff", fontSize: 18, fontWeight: "700" }}
                >
                  Submit
                </Text>
              </TouchableOpacity>
            </React.Fragment>
          ) : (
            <View
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                alignContent: "center",
              }}
            >
              <Image
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: 15, // don't change
                  marginBottom: 20,
                }}
                source={require("../assets/safer-logo2.png")}
              />
              <Text
                style={{ fontSize: 24, fontWeight: "700", marginBottom: 20 }}
              >
                Login is required
              </Text>
              <Text style={{ fontSize: 18 }}>
                <Text>Please </Text>
                <Text
                  style={[
                    styles.textMedium,
                    styles.textSizeMedium,
                    { color: "#015C92", paddingHorizontal: 10 },
                  ]}
                  onPress={() => toLogin()}
                >
                  Login
                </Text>
                <Text> to add a new report</Text>
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 10 },
  header: {
    fontSize: 24,
    fontWeight: "700",
    marginTop: 0,
    marginBottom: 20,
    // textAlign: "center",
    color: "#333",
  },
  backButton: {
    position: "absolute",
    padding: 6,
    top: 20,
    left: 10,
    backgroundColor: "#015C92",
    borderRadius: 20,
    elevation: 2,
  },
  input: {
    height: 53,
    width: "100%",
    marginBottom: 20,
    paddingHorizontal: 15,
    backgroundColor: "#f0f6fa",
    fontSize: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 2,
  },
  multilineInput: {
    height: 120,
    width: "100%",
    marginBottom: 20,
    padding: 15,
    textAlignVertical: "top",
    backgroundColor: "#f0f6fa",
    fontSize: 16,
    elevation: 1,
  },
  picker: {
    height: 45,
    borderWidth: 1,
    marginBottom: 20,
    backgroundColor: "#f0f6fa",
    shadowColor: "#000",
    elevation: 1,
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: "#015C92",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 3,
    shadowColor: "#000",
    elevation: 2,
    marginVertical: 20,
    alignItems: "center",
    justifyContent: "center",
  },
});
