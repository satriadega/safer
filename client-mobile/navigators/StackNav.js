import { createNativeStackNavigator } from "@react-navigation/native-stack";
import GetStartedScreen from "../screens/GetStartedScreen";
import RegisterScreen from "../screens/RegisterScreen";
import LoginScreen from "../screens/LoginScreen";
import Homescreen from "../screens/HomeScreen";
import ReportDetailsScreen from "../screens/ReportDetailsScreen";
import ReportListScreen from "../screens/ReportListScreen";
import AddReportScreen from "../screens/AddReportScreen";
import TabNav from "./TabNav";

const Stack = createNativeStackNavigator();

export default function StackNav() {
  return (
    <Stack.Navigator initialRouteName="Home">
      {/* <Stack.Screen name="Get-Started" component={GetStartedScreen} /> */}
      {/* <Stack.Screen name="Register" component={RegisterScreen} /> */}
      {/* <Stack.Screen name="Login" component={LoginScreen} /> */}
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen name="Report-List" component={ReportListScreen} />
      <Stack.Screen
        name="Home"
        component={TabNav}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Report-Details"
        component={ReportDetailsScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Add-Report"
        component={AddReportScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
