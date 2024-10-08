import { Tabs } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import { Pressable, Platform } from "react-native";

export const LogoutButton = () => {
  const { signOut } = useAuth();

  const doLogout = () => {
    signOut();
  };

  return (
    <Pressable onPress={doLogout} style={{ marginRight: 10 }}>
      <Ionicons name="log-out-outline" size={24} color={"#fff"} />
    </Pressable>
  );
};

const TabsPage = () => {
  const { isSignedIn } = useAuth();

  return (
    <>
      <Tabs
        screenOptions={{
          headerStyle: {
            backgroundColor: "#6c47ff",
          },
          headerTintColor: "#fff",
        }}
      >
        <Tabs.Screen
          name="pedidos"
          options={{
            headerTitle: "Pedidos",
            headerShown: Platform.OS === "ios",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="cart-outline" size={size} color={color} />
            ),
            tabBarLabel: "Pedidos",
            tabBarActiveTintColor: "#6c47ff",
          }}
          redirect={!isSignedIn}
        />
        <Tabs.Screen
          name="resumen"
          options={{
            headerTitle: "Resumen",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="stats-chart-outline" size={size} color={color} />
            ),
            tabBarLabel: "Resumen",
            tabBarActiveTintColor: "#6c47ff",
          }}
          redirect={!isSignedIn}
        />
        <Tabs.Screen
          name="map"
          options={{
            href: null,
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="navigate-outline" size={size} color={color} />
            ),
            tabBarLabel: "Mapa",
            tabBarActiveTintColor: "#6c47ff",
          }}
          redirect={!isSignedIn}
        />
        <Tabs.Screen
          name="settings"
          options={{
            headerTitle: "Configuracion",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="cog-outline" size={size} color={color} />
            ),
            tabBarLabel: "Configuracion",
            tabBarActiveTintColor: "#6c47ff",
          }}
          redirect={!isSignedIn}
        />
      </Tabs>
      <Toast />
    </>
  );
};

export default TabsPage;
