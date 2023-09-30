import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { StyleSheet, TouchableOpacity } from "react-native";
import ProfileScreen from "../screens/ProfileScreen";
import ReportListScreen from "../screens/ReportListScreen";
import HomeScreen from "../screens/HomeScreen";

const Tab = createBottomTabNavigator();

export default function TabNav() {
  return (
    <>
      <Tab.Navigator
      // initialRouteName="Dashboard"
      // initialRouteName="Dashboard"
        screenOptions={{
          tabBarShowLabel: false,
          tabBarStyle: styles.tab,
          tabBarHideOnKeyboard: true,
        }}
      >
        <Tab.Screen
          name="Report List"
          component={ReportListScreen}
          options={{
            headerShown: false,
            tabBarIcon: ({ focused }) => {
              return (
                <MaterialIcons
                  style={[
                    styles.icon,
                    {
                      backgroundColor: focused ? "#2D82B5" : 0,
                    },
                  ]}
                  name="format-list-bulleted"
                  size={22}
                  color={focused ? "#fff" : "#2D82B5"}
                />
              );
            },
          }}
        />
        <Tab.Screen
          name="Dashboard"
          component={HomeScreen}
          options={{
            headerShown: false,
            tabBarIcon: ({ focused }) => {
              return (
                <FontAwesome
                  style={[
                    styles.icon,
                    {
                      backgroundColor: focused ? "#2D82B5" : 0,
                    },
                  ]}
                  name="map"
                  size={22}
                  color={focused ? "#fff" : "#2D82B5"}
                />
              );
            },
          }}
        />
        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            headerShown: false,
            tabBarIcon: ({ focused }) => {
              return (
                <Ionicons
                  style={[
                    styles.icon,
                    {
                      backgroundColor: focused ? "#2D82B5" : 0,
                    },
                  ]}
                  name="person-sharp"
                  size={22}
                  color={focused ? "#fff" : "#2D82B5"}
                />
              );
            },
          }}
        />
      </Tab.Navigator>
    </>
  );
}

const styles = StyleSheet.create({
  tab: {
    position: "absolute",
    bottom: 25,
    left: 30,
    right: 30,
    elevation: 4,
    backgroundColor: "#fff",
    borderRadius: 40,
    height: 70,
  },
  icon: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 30,
    paddingHorizontal: 15,
  },
});
