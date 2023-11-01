import React, { useState } from "react";

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import gql from "graphql-tag";
import { useMutation } from "@apollo/client";

const LOGIN_USER = gql`
  mutation Mutation($email: String!, $password: String!) {
    loginUser(email: $email, password: $password)
  }
`;

export default function LoginScreen({ navigation }) {
  const [funcUploadLogin, { data, loading, error }] = useMutation(LOGIN_USER, {
    onError: (err) => {
      Alert.alert(
        err.networkError.result.errors[0].code,
        err.networkError.result.errors[0].message
      );
    },
  });

  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });

  const clickHandle = async () => {
    try {
      const { data } = await funcUploadLogin({
        variables: {
          email: loginForm.email,
          password: loginForm.password,
        },
      });
      console.log(data.loginUser, "<<<<<");
      let obj = JSON.parse(data.loginUser);

      await AsyncStorage.setItem("access_token", obj.access_token);
      await AsyncStorage.setItem("id", obj.id.toString());

      setLoginForm({
        email: "",
        password: "",
      });
      navigation.navigate("Home");
    } catch (err) {
      console.log(err);
    }
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
        <View style={{ flex: 1, padding: 12 }}>
          <Text style={styles.header}>Login to your Account</Text>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={loginForm.email}
            onChangeText={(e) => setLoginForm({ ...loginForm, email: e })}
          />

          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry={true}
            value={loginForm.password}
            onChangeText={(e) => setLoginForm({ ...loginForm, password: e })}
          />
          <TouchableOpacity style={styles.button} onPress={clickHandle}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>

          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              gap: 5,
            }}
          >
            <Text style={styles.registerText}>Don't have an account?</Text>
            <TouchableOpacity onPress={() => navigation.navigate("Register")}>
              <Text style={styles.registerButton}>Register Now!</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
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
  header: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 20,
    color: "#333",
    textAlign: "left",
  },
  input: {
    height: 45,
    width: "100%",
    marginBottom: 20,
    paddingHorizontal: 15,
    backgroundColor: "#f0f6fa",
    borderRadius: 10,
    fontSize: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 2,
  },
  button: {
    backgroundColor: "#015C92",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
    width: "100%",
    elevation: 2,
    marginBottom: 50,
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
    textAlign: "center",
  },
  registerText: {
    color: "#555",
    fontSize: 14,
    marginBottom: 10,
  },
  registerButton: {
    color: "#015C92",
    fontSize: 14,
    fontWeight: "bold",
  },
});
