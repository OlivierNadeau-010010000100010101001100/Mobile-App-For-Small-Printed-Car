import {
  View, Text, Pressable, StyleSheet, FlatList,
  Alert, TextInput, ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useApi } from "../providers/ProviderUrl";
import { useAppStore } from "../stores/useAppStore";
import { useTranslation } from "../i18n";
import { useTheme } from "../hooks/useTheme";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useEffect, useState } from "react";

export default function Main() {
  const navigation = useNavigation();
  const { user, get_beer_schedule, delete_beer_schedule, create_beer_schedule } = useApi();
  const language = useAppStore((s) => s.language);
  const { t } = useTranslation(language);
  const theme = useTheme();

  const [schedules,     setSchedules]     = useState([]);
  const [loading,       setLoading]       = useState(false);
  const [fetchError,    setFetchError]    = useState(false);
  const [timeDeparture, setTimeDeparture] = useState("");
  const [distance,      setDistance]      = useState("");

  useEffect(() => { if (user) fetchSchedules(); }, [user]);

  const fetchSchedules = async () => {
    try {
      setLoading(true);
      setFetchError(false);
      const data = await get_beer_schedule(user.user_id);
      setSchedules(data);
    } catch (e) {
      console.error("Fetch schedules error:", e);
      setFetchError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!timeDeparture || !distance) { Alert.alert(t("home.errorFields")); return; }
    try {
      await create_beer_schedule(user.user_id, timeDeparture, distance);
      setTimeDeparture(""); setDistance("");
      fetchSchedules();
    } catch {
      Alert.alert(t("home.errorAdd"));
    }
  };

  const handleDelete = (scheduleId) => {
    Alert.alert(t("home.confirmDelete"), t("home.confirmDeleteText"), [
      { text: t("home.cancel"), style: "cancel" },
      { text: t("home.delete"), style: "destructive", onPress: async () => {
        try { await delete_beer_schedule(user.user_id, scheduleId); fetchSchedules(); }
        catch { Alert.alert(t("home.errorDelete")); }
      }},
    ]);
  };

  const handleEdit = (schedule) => {
    Alert.alert(
      t("home.editSchedule"),
      `${t("home.timeDeparture")}: ${schedule.time_departure}\n${t("home.distance")}: ${schedule.distance_to_dropzone} km`
    );
  };

  const renderItem = ({ item }) => (
    <View style={[styles.scheduleItem, { backgroundColor: theme.card, borderColor: theme.border }]}>
      <View style={{ flex: 1 }}>
        <Text style={[styles.scheduleText, { color: theme.text }]}>
          {t("home.timeDeparture")}: {item.time_departure}
        </Text>
        <Text style={[styles.scheduleText, { color: theme.subText }]}>
          {t("home.distance")}: {item.distance_to_dropzone} km
        </Text>
      </View>
      <Pressable onPress={() => handleEdit(item)} style={styles.iconButton}>
        <MaterialIcons name="edit" size={24} color={theme.subText} />
      </Pressable>
      <Pressable onPress={() => handleDelete(item.schedule_id)} style={styles.iconButton}>
        <MaterialIcons name="delete" size={24} color="red" />
      </Pressable>
    </View>
  );

  const EmptySchedules = () => (
    <View style={[styles.emptyContainer, { borderColor: theme.border }]}>
      <Text style={[styles.emptyTitle, { color: theme.text }]}>{t("home.emptyTitle")}</Text>
      <Text style={[styles.emptySubtext, { color: theme.subText }]}>{t("home.emptySubtext")}</Text>
    </View>
  );

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>{t("home.title")}</Text>

      {user
        ? <Text style={[styles.username, { color: theme.subText }]}>{t("home.loggedIn")}: {user.username}</Text>
        : <Text style={[styles.username, { color: theme.subText }]}>{t("home.notLoggedIn")}</Text>
      }

      <Pressable style={styles.button} onPress={() => navigation.navigate("ControllerRC")}>
        <Text style={styles.buttonText}>{t("home.goToController")}</Text>
      </Pressable>

      {user && (
        <View style={styles.schedulesSection}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>{t("home.beerSchedules")}</Text>

          <View style={styles.form}>
            <TextInput
              placeholder="HH:MM"
              placeholderTextColor={theme.subText}
              value={timeDeparture}
              onChangeText={setTimeDeparture}
              style={[styles.input, { backgroundColor: theme.inputBg, borderColor: theme.border, color: theme.text }]}
            />
            <TextInput
              placeholder={`${t("home.distance")} (km)`}
              placeholderTextColor={theme.subText}
              value={distance}
              onChangeText={setDistance}
              keyboardType="numeric"
              style={[styles.input, { backgroundColor: theme.inputBg, borderColor: theme.border, color: theme.text }]}
            />
            <Pressable style={styles.addButton} onPress={handleAdd}>
              <Text style={styles.buttonText}>{t("home.add")}</Text>
            </Pressable>
          </View>

          {fetchError ? (
            <Text style={[styles.errorText, { color: theme.subText }]}>{t("home.errorFetch")}</Text>
          ) : (
            <FlatList
              data={schedules}
              keyExtractor={(item) => item.schedule_id.toString()}
              renderItem={renderItem}
              refreshing={loading}
              onRefresh={fetchSchedules}
              scrollEnabled={false}
              ListEmptyComponent={<EmptySchedules />}
            />
          )}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container:       { padding: 50, alignItems: "center" },
  title:           { fontSize: 24, marginBottom: 20 },
  username:        { fontSize: 18, marginBottom: 20 },
  button:          { backgroundColor: "blue", padding: 12, borderRadius: 15, width: "80%", alignItems: "center" },
  buttonText:      { color: "#fff", fontSize: 16 },
  schedulesSection:{ marginTop: 30, width: "100%" },
  sectionTitle:    { fontSize: 20, marginBottom: 10, fontWeight: "bold" },
  form:            { marginBottom: 15 },
  input:           { borderWidth: 1, padding: 10, marginBottom: 10, borderRadius: 8 },
  addButton:       { backgroundColor: "green", padding: 12, borderRadius: 10, alignItems: "center" },
  scheduleItem:    { flexDirection: "row", alignItems: "center", padding: 12, marginVertical: 6, borderWidth: 1, borderRadius: 10 },
  scheduleText:    { fontSize: 16 },
  iconButton:      { padding: 8, marginLeft: 8 },
  emptyContainer:  { alignItems: "center", paddingVertical: 32, marginTop: 8, borderWidth: 1, borderRadius: 12, borderStyle: "dashed" },
  emptyTitle:      { fontSize: 16, fontWeight: "600", marginBottom: 4 },
  emptySubtext:    { fontSize: 13 },
  errorText:       { textAlign: "center", marginTop: 16, fontSize: 14 },
});
