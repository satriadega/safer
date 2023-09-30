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
    uploadCloudinary(image);
  };

  const funcAccessToken = async () => {
    try {
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
          latitudeDelta: "0.025",
          longitudeDelta: "0.025",
          // location: location
        };

        console.log(access_token, "acc token client add");
        console.log(payload, "<<<<<< PAYLOAD CLIENT");
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
          <Text style={styles.header}>New Report</Text>
        </View>
        <View style={{ flex: 1, padding: 12 }}>
          {access_token ? (
            <React.Fragment>
              <TextInput
                style={styles.input}
                onChangeText={setTitle}
                value={title}
                placeholder="Title"
              />
              <TextInput
                style={styles.multilineInput}
                onChangeText={setDescription}
                value={description}
                multiline={true}
                numberOfLines={5}
                placeholder="Description"
              />
              <View
                style={{
                  borderRadius: 10,
                  overflow: "hidden",
                  elevation: 1,
                  margin: 1,
                }}
              >
                <Picker
                  style={{ backgroundColor: "#f0f6fa", height: 50 }}
                  selectedValue={typeId}
                  onValueChange={(itemValue) => setTypeId(itemValue)}
                >
                  {data?.types.map((type) => (
                    <Picker.Item
                      key={type.id}
                      label={type.name}
                      value={type.id.toString()}
                    />
                  ))}
                </Picker>
              </View>
              <Cloudinary image={image} setImage={setImage} />
              <TouchableOpacity
                style={styles.submitButton}
                onPress={submitReport}
              >
                <Text style={{ color: "white", fontWeight: "700" }}>
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
                  borderRadius: 15,
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
    textAlign: "center",
    top: 30,
    fontWeight: "700",
    fontSize: 24,
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
    height: 45,
    width: "100%",
    marginBottom: 20,
    paddingHorizontal: 15,
    backgroundColor: "#f0f6fa",
    borderRadius: 10,
    fontSize: 14,
    elevation: 1,
  },
  multilineInput: {
    height: 120,
    width: "100%",
    marginBottom: 20,
    padding: 15,
    textAlignVertical: "top",
    backgroundColor: "#f0f6fa",
    borderRadius: 10,
    fontSize: 14,
    elevation: 1,
  },
  picker: {
    height: 45,
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 20,
    backgroundColor: "#f0f6fa",
    shadowColor: "#000",
    elevation: 1,
    fontSize: 12,
  },
  submitButton: {
    backgroundColor: "#015C92",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
    shadowColor: "#000",
    elevation: 2,
    marginVertical: 20,
    alignItems: "center",
    justifyContent: "center",
  },
});
