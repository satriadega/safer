import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { TextInput, Button } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import { Cloudinary } from "@cloudinary/url-gen";
import { Entypo } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";

const FormUpload = ({ image, setImage }) => {
  const [hasGalleryPermission, setHasGalleryPermission] = useState(null);
  const [hasCameraPermission, setHasCameraPermission] = useState(null);

  useEffect(() => {
    (async () => {
      const galleryStatus =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      // console.log(galleryStatus);
      // Ask the user for the permission to access the camera
      const permissionResult =
        await ImagePicker.requestCameraPermissionsAsync();

      setHasCameraPermission(permissionResult.status === "granted");
      setHasGalleryPermission(galleryStatus.status === "granted");
    })();
  }, []);

  const cld = new Cloudinary({
    cloud: {
      cloudName: "dapqihnih",
    },
    url: {
      secure: true,
    },
  });

  const options = {
    upload_preset: "safer-app",
    unsigned: true,
  };

  const pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 0.7,
        base64: true,
      });

      // console.log(result.assets[0].base64, "ininih");
      console.log(result.canceled);
      if (!result.canceled) {
        setImage(`data:image/jpg;base64,${result.assets[0].base64}`);
      }
    } catch (err) {
      console.log(err);
    }
  };

  if (hasGalleryPermission === false) {
    return <Text>No access to Internal Storage</Text>;
  }

  if (hasCameraPermission === false) {
    return <Text>No access to Camera</Text>;
  }

  const openCamera = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        quality: 0.7,
        base64: true,
      });
      // console.log(result.assets[0].base64, "dapet nih");
      if (!result.canceled) {
        console.log(result.assets[0].uri);
        setImage(`data:image/jpg;base64,${result.assets[0].base64}`);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center" }}>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          marginBottom: 20,
        }}
      >
        <TouchableOpacity title="Pick Image" onPress={() => pickImage()}>
          <View style={styles.imageButton}>
            <FontAwesome name="file-photo-o" size={30} color="grey" />
          </View>
        </TouchableOpacity>
        <TouchableOpacity title="Open camera" onPress={() => openCamera()}>
          <View style={styles.imageButton}>
            <Entypo name="camera" size={30} color="grey" />
          </View>
        </TouchableOpacity>
      </View>

      {image && (
        <View
          style={{
            padding: 20,
            // borderRadius: 20,
            backgroundColor: "#f0f6fa",
            elevation: 1,
            // margin: 1,
            display: "flex",
            alignItems: "center",
          }}
        >
          <Image
            source={{ uri: image }}
            style={{
              width: "50%",
              height: "100%",
              resizeMode: "contain",
              borderRadius: 10,
              objectFit: "cover",
            }}
          />
        </View>
      )}
      {!image && (
        <View
          style={{
            padding: 60,
            // borderRadius: 20,
            backgroundColor: "#f0f6fa",
            elevation: 1,
            // margin: 1,
            display: "flex",
            alignItems: "center",
          }}
        >
          <FontAwesome name="image" size={70} color="grey" />
        </View>
      )}
    </View>
  );
};

const theme = {
  colors: {
    primary: "red",
  },
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  input: {
    // margin: 6,
  },
  buttonModalView: {
    flexDirection: "row",
    padding: 10,
    justifyContent: "space-around",
    backgroundColor: "white",
  },
  modalView: {
    position: "absolute",
    bottom: 2,
    width: "100%",
    height: 120,
  },
  imageButton: {
    flex: 1,
    backgroundColor: "#f0f6fa",
    paddingVertical: 15,
    paddingHorizontal: 60,
    elevation: 1,
    objectFit: "cover",
  },
});

export default FormUpload;
