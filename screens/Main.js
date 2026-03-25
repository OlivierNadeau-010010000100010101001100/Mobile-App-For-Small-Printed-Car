import {
  View,
  Text,
  Pressable,
  StyleSheet,
  FlatList,
  Alert,
  TextInput,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useApi } from "../providers/ProviderUrl";
import { useAppStore } from "../stores/useAppStore";
import { useTranslation } from "../i18n";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useEffect, useState } from "react";

export default function Main() {
  const navigation = useNavigation();

  const {
    user,
    get_beer_schedule,
    delete_beer_schedule,
    create_beer_schedule,
  } = useApi();

  const language = useAppStore((s) => s.language);
  const { t } = useTranslation(language);

  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(false);

  const [timeDeparture, setTimeDeparture] = useState("");
  const [distance, setDistance] = useState("");

  useEffect(() => {
    if (user) fetchSchedules();
  }, [user]);

  const fetchSchedules = async () => {
    try {
      setLoading(true);
      const data = await get_beer_schedule(user.user_id);
      setSchedules(data);
    } catch (e) {
      console.error("Erreur fetch schedules:", e);
      Alert.alert("Erreur", "Impossible de récupérer les schedules.");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!timeDeparture || !distance) {
      Alert.alert("Erreur", "Remplis tous les champs");
      return;
    }

    try {
      await create_beer_schedule(
        user.user_id,
        timeDeparture,
        distance
      );

      setTimeDeparture("");
      setDistance("");

      fetchSchedules();
    } catch (e) {
      console.error("Erreur ajout:", e);
      Alert.alert("Erreur", "Impossible d'ajouter le schedule.");
    }
  };

  const handleDelete = (scheduleId) => {
    Alert.alert(t("home.confirmDelete"), t("home.confirmDeleteText"), [
      { text: t("home.cancel"), style: "cancel" },
      {
        text: t("home.delete"),
        style: "destructive",
        onPress: async () => {
          try {
            await delete_beer_schedule(user.user_id, scheduleId);
            fetchSchedules();
          } catch (e) {
            console.error("Erreur suppression:", e);
            Alert.alert("Erreur", "Impossible de supprimer ce schedule.");
          }
        },
      },
    ]);
  };

  const handleEdit = (schedule) => {
    Alert.alert(
      t("home.editSchedule"),
      `${t("home.timeDeparture")}: ${schedule.time_departure}\n${t("home.distance")}: ${schedule.distance_to_dropzone}`
    );
  };

  const renderItem = ({ item }) => (
    <View style={styles.scheduleItem}>
      <View style={{ flex: 1 }}>
        <Text style={styles.scheduleText}>
          {t("home.timeDeparture")}: {item.time_departure}
        </Text>
        <Text style={styles.scheduleText}>
          {t("home.distance")}: {item.distance_to_dropzone} km
        </Text>
      </View>

      <Pressable onPress={() => handleEdit(item)} style={styles.iconButton}>
        <MaterialIcons name="edit" size={24} color="#555" />
      </Pressable>

      <Pressable
        onPress={() => handleDelete(item.schedule_id)}
        style={styles.iconButton}
      >
        <MaterialIcons name="delete" size={24} color="red" />
      </Pressable>
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{t("home.title")}</Text>

      {user ? (
        <Text style={styles.username}>
          {t("home.loggedIn")} : {user.username}
        </Text>
      ) : (
        <Text style={styles.username}>{t("home.notLoggedIn")}</Text>
      )}

      <Pressable
        style={styles.button}
        onPress={() => navigation.navigate("ControllerRC")}
      >
        <Text style={styles.buttonText}>{t("home.goToController")}</Text>
      </Pressable>

      {user && (
        <View style={{ marginTop: 30, width: "100%" }}>
          <Text style={styles.sectionTitle}>
            {t("home.beerSchedules")}
          </Text>

          {/* INPUTS */}
          <View style={{ marginBottom: 15 }}>
            <TextInput
              placeholder="HH:MM"
              value={timeDeparture}
              onChangeText={setTimeDeparture}
              style={styles.input}
            />

            <TextInput
              placeholder="Distance (km)"
              value={distance}
              onChangeText={setDistance}
              keyboardType="numeric"
              style={styles.input}
            />

            <Pressable style={styles.addButton} onPress={handleAdd}>
              <Text style={styles.buttonText}>Add</Text>
            </Pressable>
          </View>

          {/* LIST */}
          <FlatList
            data={schedules}
            keyExtractor={(item) => item.schedule_id.toString()}
            renderItem={renderItem}
            refreshing={loading}
            onRefresh={fetchSchedules}
            scrollEnabled={false} // ✅ IMPORTANT
            ListEmptyComponent={
              <Text style={{ textAlign: "center", marginTop: 20 }}>
                {t("home.noSchedules")}
              </Text>
            }
          />
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 50,
    alignItems: "center",
  },

  title: { fontSize: 24, marginBottom: 20 },

  username: { fontSize: 18, marginBottom: 20, color: "#333" },

  button: {
    backgroundColor: "blue",
    padding: 12,
    borderRadius: 15,
    width: "80%",
    alignItems: "center",
  },

  buttonText: { color: "#fff", fontSize: 16 },

  sectionTitle: {
    fontSize: 20,
    marginBottom: 10,
    fontWeight: "bold",
  },

  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
    backgroundColor: "#fff",
  },

  addButton: {
    backgroundColor: "green",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },

  scheduleItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    marginVertical: 6,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    backgroundColor: "#f9f9f9",
  },

  scheduleText: { fontSize: 16 },

  iconButton: { padding: 8, marginLeft: 8 },
});