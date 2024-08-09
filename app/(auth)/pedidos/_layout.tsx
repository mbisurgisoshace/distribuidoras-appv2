import {
  TransitionPresets,
  createStackNavigator,
  StackNavigationOptions,
  StackNavigationEventMap,
} from "@react-navigation/stack";
import { Platform } from "react-native";
import { withLayoutContext, Stack } from "expo-router";
import { ParamListBase, StackNavigationState } from "@react-navigation/native";

const { Navigator } = createStackNavigator();

export const JsStack = withLayoutContext<
  StackNavigationOptions,
  typeof Navigator,
  StackNavigationState<ParamListBase>,
  StackNavigationEventMap
>(Navigator);

const PedidosPage = () => {
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
