import React from "react";
import MapView from "react-native-maps";
import { useUser } from "@clerk/clerk-expo";
import { View, StyleSheet } from "react-native";

const Map = () => {
  const { user } = useUser();

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <MapView style={styles.map} />
    </View>
  );
};

const styles = StyleSheet.create({
  map: {
    width: "100%",
    height: "100%",
  },
});

export default Map;
