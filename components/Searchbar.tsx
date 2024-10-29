import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Input from "./ui/Input";

interface SearchbarProps {
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
}

export default function Searchbar({
  value,
  onChange,
  placeholder = "",
}: SearchbarProps) {
  return (
    <View style={styles.searchbar}>
      <Ionicons
        style={styles.iconSearch}
        name="search"
        size={24}
        color="#6c47ff"
      />
      <Input
        value={value}
        style={styles.input}
        onChange={onChange}
        placeholder={placeholder}
      />
      <TouchableOpacity style={styles.iconDelete} onPress={() => onChange("")}>
        <Ionicons name="close" size={24} color="#6c47ff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  searchbar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  iconSearch: {
    left: 25,
    zIndex: 1,
    position: "absolute",
  },
  iconDelete: {
    right: 25,
    zIndex: 1,
    position: "absolute",
  },
  input: {
    flex: 1,
    paddingHorizontal: 40,
  },
});
