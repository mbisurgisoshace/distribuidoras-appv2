import { View, StyleSheet, Text } from "react-native";

interface PedidoFieldProps {
  value: string;
  textColor?: string;
  icon: React.ReactNode;
}

export default function PedidoField({
  value,
  icon,
  textColor = "black",
}: PedidoFieldProps) {
  return (
    <View style={styles.field}>
      {icon}
      <Text style={[styles.value, { color: textColor }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    gap: 10,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  value: {
    fontSize: 15,
    fontWeight: "600",
  },
});
