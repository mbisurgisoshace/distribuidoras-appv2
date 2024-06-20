import { View, StyleSheet } from "react-native";

export default function Card({ children }: { children: React.ReactNode }) {
  return <View style={styles.card}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    width: "100%",
    elevation: 14,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowRadius: 6,
    borderRadius: 5,
    shadowOpacity: 0.3,
    shadowColor: "black",
    backgroundColor: "white",
  },
});
