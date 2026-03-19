import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { TabsNavigator } from "./TabsNavigator";
import Login from "../screens/Login";
import ControllerButtons from "../screens/ControllerText";

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Tabs" component={TabsNavigator} />
        <Stack.Screen name="ControllerRC" component={ControllerButtons} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}