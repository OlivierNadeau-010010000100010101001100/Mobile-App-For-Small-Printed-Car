import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import Main from "../screens/Main";
import {Settings} from "../screens/Settings"
import { HeaderRight } from "../components/HeaderRight";
import ControllerButtons from "../screens/ControllerText";
import { useAppStore } from "../stores/useAppStore";
import { useTranslation } from "../i18n";


const Tab = createBottomTabNavigator();

export function TabsNavigator() {
    
    const language = useAppStore((s) => s.language);
    const { t } = useTranslation(language);
    



  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarLabelPosition: "below-icon",
      }}
    >
      <Tab.Screen
        name="Main"
        component={Main}
        options={{
          title: t("home.title"),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" color={color} size={size} />
          ),
        }}
      />
      
      <Tab.Screen
        name="Settings"
        component={Settings}
        options={{
          title: t("settings.title"),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="cog" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>

    
  );
}