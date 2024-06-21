import {
  createStackNavigator,
  StackNavigationOptions,
  TransitionPresets,
} from "@react-navigation/stack";
import { Platform } from "react-native";
import { withLayoutContext, Stack } from "expo-router";

const { Navigator } = createStackNavigator();

export const JsStack = withLayoutContext<
  StackNavigationOptions,
  typeof Navigator
>(Navigator);

const PedidosPage = () => {
  if (Platform.OS === "android")
    return (
      <JsStack>
        <JsStack.Screen
          name="index"
          options={{
            headerShown: false,
          }}
        />
        <JsStack.Screen
          name="[id]"
          options={{
            ...TransitionPresets.ModalPresentationIOS,
            presentation: "modal",
          }}
        />
      </JsStack>
    );

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="[id]"
        options={{
          presentation: "modal",
        }}
      />
    </Stack>
  );
};

export default PedidosPage;
