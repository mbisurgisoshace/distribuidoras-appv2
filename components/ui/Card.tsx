import { View, StyleSheet } from "react-native";

interface CardProps {
  backgroundColor?: string;
  children: React.ReactNode;
}

export default function Card({
  children,
  backgroundColor = "white",
}: CardProps) {
  return <View style={{ ...styles.card, backgroundColor }}>{children}</View>;
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
