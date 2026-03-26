import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import Main from "../screens/Main";
import { Settings } from "../screens/Settings";
import { useAppStore } from "../stores/useAppStore";
import { useTranslation } from "../i18n";
import { useTheme } from "../hooks/useTheme";

const Tab = createBottomTabNavigator();

export function TabsNavigator() {
  const language = useAppStore((s) => s.language);
  const { t } = useTranslation(language);
  const theme = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarLabelPosition: "below-icon",
        tabBarStyle: {
          backgroundColor: theme.tabBar,
          borderTopColor: theme.tabBarBorder,
        },
        tabBarActiveTintColor:   "#007AFF",
        tabBarInactiveTintColor: theme.subText,
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