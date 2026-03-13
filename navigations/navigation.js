import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Main from "../screens/Main";
import ControllerRC from "../screens/ControllerRC";
import ControllerButtons from "../screens/ControllerText";

const Navigation = createNativeStackNavigator();

// est la navigation principale (le bottom tabs)
export default function NavigationMain() {
  return (
    <NavigationContainer>
      <Navigation.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Navigation.Screen name="Main" component={Main} />
        <Navigation.Screen name="ControllerRC" component={ControllerButtons} />
      </Navigation.Navigator>
    </NavigationContainer>
  );
}
