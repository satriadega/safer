import React, { useState } from "react";
import {
  Text,
  TextInput,
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { gql, useMutation } from "@apollo/client";
import alertErrors from "../utils/alertErrors";

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
  const [gender, setGender] = useState("male");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");

  const [funcCreateUser, { data, loading, error }] = useMutation(ADD_USER, {
    onError: (err) => {
      console.log(name, email, password, phoneNumber);
      alertErrors(err);
    },
  });
  const submitUser = async () => {
    try {
      const payload = { name, email, password, gender, phoneNumber, address };
      const { data } = await funcCreateUser({
        variables: {
          newUser: payload,
        },
      });

      console.log(loading, "ini loading...");
      if (data) {
        setName("");
        setEmail("");
        setPassword("");
        setGender("male");
        setPhoneNumber("");
        setAddress("");
        navigation.navigate("Home");
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={{ flex: 1, padding: 12 }}
        keyboardShouldPersistTaps="handled"
      >
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
            placeholderTextColor="#000"
          />
          <TextInput
            style={styles.input}
            onChangeText={setEmail}
            value={email}
            placeholder="Email"
            placeholderTextColor="#000"
          />
          <TextInput
            style={styles.input}
            onChangeText={setPassword}
            value={password}
            placeholder="Password"
            placeholderTextColor="#000"
            secureTextEntry={true}
          />
          <Picker
            style={styles.input}
            selectedValue={gender}
            onValueChange={(itemValue) => {
              setGender(itemValue);
            }}
          >
            <Picker.Item label="Male" value="male" />
            <Picker.Item label="Female" value="female" />
          </Picker>
          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            placeholderTextColor="#000"
            onChangeText={setPhoneNumber}
            value={phoneNumber}
          />
          <TextInput
            style={styles.multilineInput}
            onChangeText={setAddress}
            value={address}
            multiline={true}
            numberOfLines={5}
            placeholder="Address"
            placeholderTextColor="#000"
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
  button: {
    backgroundColor: "#015C92",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
    width: "100%",
    elevation: 2,
    marginTop: 16,
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
    textAlign: "center",
  },
  multilineInput: {
    height: 120,
    width: "100%",
    marginBottom: 20,
    padding: 15,
    textAlignVertical: "top",
    backgroundColor: "#f0f6fa",
    fontSize: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 2,
  },
});
