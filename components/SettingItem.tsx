import { useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface SettingItemProps {
  title: string;
  ultimaActualizacion: string;
  actualizar: () => Promise<void>;
}

export default function SettingItem({
  title,
  actualizar,
  ultimaActualizacion,
}: SettingItemProps) {
  const [isLoading, setIsLoading] = useState(false);

  const onActualizarInfo = async () => {
    setIsLoading(true);
    await actualizar();
    setIsLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.actualizacionContainer}>
        <View style={{ gap: 5 }}>
          <Text style={styles.ultimaActualizacionTitle}>
            Ultima actualizacion
          </Text>
          <Text style={styles.ultimaActualizacion}>
            {ultimaActualizacion || "-"}
          </Text>
        </View>
        <TouchableOpacity disabled={isLoading} onPress={onActualizarInfo}>
          {isLoading ? (
            <ActivityIndicator size={24} color={"#6c47ff"} />
          ) : (
            <Ionicons name="cloud-download-outline" size={24} color="#6c47ff" />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingVertical: 5,
    borderBottomWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    borderBottomColor: "#bdc3c7",
    justifyContent: "space-between",
  },
  actualizacionContainer: {
    gap: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontSize: 14,
    color: "#6c47ff",
    fontWeight: "bold",
  },
  ultimaActualizacionTitle: {
    fontSize: 12,
    color: "#95a5a6",
  },
  ultimaActualizacion: {
    fontSize: 12,
    fontWeight: "bold",
  },
});
