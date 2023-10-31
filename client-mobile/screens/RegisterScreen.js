import React, { useState } from "react";
import {
  Text,
  TextInput,
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { gql, useMutation } from "@apollo/client";

export default function RegisterScreen({ navigation }) {
  const ADD_USER = gql`
    mutation Mutation($newUser: UserInput) {
      createUser(newUser: $newUser) {
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

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [gender, setGender] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");

  const [funcCreateUser, { data, loading, error }] = useMutation(ADD_USER);

  const submitUser = () => {
    if (!name || !email || !password || !gender || !phoneNumber || !address) {
      Alert.alert("Invalid Input", "Please fill in all fields");
      return;
    }

    // Regular expression for validating email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert("Invalid Input", "Invalid email format");
      return;
    }

    const payload = { name, email, password, gender, phoneNumber, address };
    funcCreateUser({
      variables: {
        newUser: payload,
      },
    });

    console.log(data, "ini nih;");
    // setName("");
    // setEmail("");
    // setPassword("");
    // setGender("");
    // setPhoneNumber("");
    // setAddress("");
    // navigation.navigate("Home");
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
          <Text style={styles.header}>Create your Account</Text>
          <TextInput
            style={styles.input}
            onChangeText={setName}
            value={name}
            placeholder="Name"
          />
          <TextInput
            style={styles.input}
            onChangeText={setEmail}
            value={email}
            placeholder="Email"
          />
          <TextInput
            style={styles.input}
            onChangeText={setPassword}
            value={password}
            placeholder="Password"
            secureTextEntry={true}
          />
          <TextInput
            style={styles.input}
            placeholder="Gender"
            onChangeText={setGender}
            value={gender}
          />
          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            onChangeText={setPhoneNumber}
            value={phoneNumber}
          />
          <TextInput
            style={styles.input}
            placeholder="Address"
            onChangeText={setAddress}
            value={address}
          />
          <TouchableOpacity style={styles.button} onPress={submitUser}>
            <Text style={styles.buttonText}>Register</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#f8f8f8",
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
    marginBottom: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
    textAlign: "center",
  },
});
