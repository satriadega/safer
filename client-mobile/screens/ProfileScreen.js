import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Pressable,
  Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/core";
import { Ionicons } from "@expo/vector-icons";
import { gql, useMutation, useQuery } from "@apollo/client";
import alertErrors from "../utils/alertErrors";

const GET_USER = gql`
  query GetUser($userId: ID!) {
    user(id: $userId) {
      address
      email
      gender
      id
      name
      password
      phoneNumber
    }
  }
`;

export default function ProfileScreen({ navigation }) {
  const [access_token, setAccessToken] = useState(false);
  const [id, setId] = useState(false);
  const [user, setUser] = useState({
    name: "",
    email: "",
    gender: "",
    phoneNumber: "",
    address: "",
  });

  const funcAccessToken = async () => {
    try {
      const getAccessToken = await AsyncStorage.getItem("access_token");
      const getId = await AsyncStorage.getItem("id");
      setAccessToken(getAccessToken);
      setId(getId);
    } catch (err) {
      console.log(err, "jalan");
    }
  };

  const {
    loading: loadingUser,
    error,
    data: dataUser,
    refetch,
  } = useQuery(GET_USER, {
    variables: {
      userId: +id,
    },
    context: {
      headers: {
        access_token: access_token,
      },
    },
    onCompleted: () => {
      console.log(dataUser);
    },
    onError: (err) => {
      console.log(err.toString(), "jalan");
      if (err.toString() === "ApolloError: Invalid token") {
        removeToken();
        console.log("hapus");
      }
    },
  });

  // const decoded = jwtDecode(access_token);
  // console.log(decoded, "<<<>>>DECODED");
  const removeToken = async () => {
    console.log("gakjalan");
    await AsyncStorage.removeItem("access_token");
    await AsyncStorage.removeItem("id");
    navigation.navigate("Login");
  };

  useFocusEffect(
    React.useCallback(() => {
      funcAccessToken();
      console.log(access_token, id);
      // refetch();
    }, [])
  );

  const handelLogout = async () => {
    try {
      await AsyncStorage.removeItem("access_token");
      await AsyncStorage.removeItem("id");
      setAccessToken(false);
      setId(false);
      navigation.navigate("Report List");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <View style={styles.container}>
      {access_token ? (
        <>
          <View style={styles.container}>
            <Ionicons
              style={{
                backgroundColor: "#f0f6fa",
                borderRadius: 50,
                padding: 20,
                elevation: 2,
              }}
              name="person"
              size={50}
              color="#015C92"
            />
            {dataUser && (
              <>
                <View>
                  <Text style={styles.username}>{dataUser?.user?.name}</Text>
                  <Text style={styles.data}>{dataUser?.user?.email}</Text>
                  <Text style={styles.data}>{dataUser?.user?.phoneNumber}</Text>
                  <Text style={styles.data}>{dataUser?.user?.gender}</Text>
                  <Text style={styles.justifyData}>
                    {dataUser?.user?.address}
                  </Text>
                </View>
                <View style={{ marginVertical: 20 }}>
                  <Pressable style={styles.button} onPress={handelLogout}>
                    <Text style={styles.buttonText}>Logout</Text>
                  </Pressable>
                </View>
              </>
            )}
          </View>
        </>
      ) : (
        <View>
          <View style={{ padding: 60 }}>
            <View
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginVertical: 10,
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
            </View>
            <Text style={styles.title}>Welcome to Your Profile</Text>
            <Text style={styles.subtitle}>Login to have full access</Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                navigation.navigate("Login");
              }}
            >
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f8f8",
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 30,
    color: "#555",
    textAlign: "center",
  },
  button: {
    backgroundColor: "#015C92",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 3,
    width: "100%",
    elevation: 2,
    marginBottom: 50,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
  },
  username: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 5,
    textAlign: "center",
    width: 250,
  },
  data: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    width: 250,
    marginTop: 10,
  },
  justifyData: {
    fontSize: 16,
    color: "#555",
    textAlign: "justify",
    width: 250,
    marginTop: 10,
    marginBottom: 10,
  },
});
