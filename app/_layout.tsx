import "react-native-reanimated";
import { useEffect } from "react";
import { useFonts } from "expo-font";
import { config } from "@gluestack-ui/config";
import * as SecureStore from "expo-secure-store";
import * as SplashScreen from "expo-splash-screen";
import { GluestackUIProvider } from "@gluestack-ui/themed";
import { ClerkProvider, useAuth } from "@clerk/clerk-expo";
import { Stack, Slot, useSegments, useRouter } from "expo-router";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const CLERK_PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

const InitialLayout = () => {
  const router = useRouter();
  const segments = useSegments();
  const { isLoaded, isSignedIn } = useAuth();
  console.log("isSignedIn", isSignedIn);

  useEffect(() => {
    if (!isLoaded) return;

    const inTabsGroup = segments[0] === "(auth)";

    if (isSignedIn && !inTabsGroup) {
      router.replace("/home");
    } else if (!isSignedIn) {
      router.replace("/login");
    }
  }, [isSignedIn]);

  return <Slot />;
};

const tokenCache = {
  async getToken(key: string) {
    try {
      return SecureStore.getItemAsync(key);
    } catch (err) {
      return null;
    }
  },
  async saveToken(key: string, value: string) {
    try {
      return SecureStore.setItemAsync(key, value);
    } catch (err) {
      return;
    }
  },
};

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ClerkProvider
      publishableKey={CLERK_PUBLISHABLE_KEY!}
      tokenCache={tokenCache}
    >
      <GluestackUIProvider config={config}>
        <InitialLayout />
      </GluestackUIProvider>
    </ClerkProvider>
  );
}
