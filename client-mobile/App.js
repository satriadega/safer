import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import StackNav from "./navigators/StackNav";
import { ApolloProvider } from "@apollo/client";
import client from "./config/apollo";
import Cloudinary from "./screens/Cloudinary";
import "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <ApolloProvider client={client}>
          <NavigationContainer>
            <StatusBar style="auto" />
            <StackNav />
          </NavigationContainer>
          {/* <Cloudinary /> */}
        </ApolloProvider>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});

//
