import { View, StyleSheet } from "react-native";

interface CardProps {
  backgroundColor?: string;
  children: React.ReactNode;
  size?: "small" | "medium";
}

export default function Card({
  children,
  size = "medium",
  backgroundColor = "white",
}: CardProps) {
  return (
    <View
      style={{
        ...styles.card,
        backgroundColor,
        padding: size === "medium" ? 16 : 8,
      }}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    width: "100%",
    //elevation: 14,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowRadius: 6,
    borderRadius: 5,
    shadowOpacity: 0.3,
    shadowColor: "black",
  },
});
