import { Image, Text, View } from "react-native";

export default function UserProfile() {
  return (
    <View>
      <Text>INI UNTUK USER YANG SUDAH LOGIN</Text>
      <View
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Image
          style={{ height: 100, width: 100 }}
          source={{
            uri: "https://plus.unsplash.com/premium_photo-1664474619075-644dd191935f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aW1hZ2V8ZW58MHx8MHx8fDA%3D&w=1000&q=80",
          }}
        />
      </View>
    </View>
  );
}
