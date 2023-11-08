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
import UserProfile from "../components/UserProfile";
import { Ionicons } from "@expo/vector-icons";

export default function ProfileScreen({ navigation }) {
  const [loading, setLoading] = useState(false);
  const [access_token, setAccessToken] = useState("");

  // const decoded = jwtDecode(access_token);
  // console.log(decoded, "<<<>>>DECODED");
  const funcAccessToken = async () => {
    try {
      const getAccessToken = await AsyncStorage.getItem("access_token");
      setAccessToken(getAccessToken);
    } catch (err) {
      console.log(err);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      funcAccessToken();
    }, [])
  );

  const handelLogout = async () => {
    await AsyncStorage.removeItem("access_token");
    setAccessToken("");
    navigation.navigate("Login");
  };

  const printAT = () => {
    console.log(access_token, "<<<<<<<<< access_token dari profile");
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
            <View>
              <Text style={styles.username}>Username</Text>
              <Text style={styles.data}>user@example.com</Text>
              <Text style={styles.data}>+62821092873</Text>
              <Text style={styles.data}>Male</Text>
              <Text style={styles.data}>Address</Text>
            </View>
            <View style={{ marginVertical: 20 }}>
              <Pressable style={styles.button} onPress={handelLogout}>
                <Text style={styles.buttonText}>Logout</Text>
              </Pressable>
            </View>
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
  },
  data: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
  },
});
