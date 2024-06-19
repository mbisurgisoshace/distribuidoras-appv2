import { StyleSheet, TextInput } from "react-native";

interface InputProps {
  value: string;
  placeholder?: string;
  secureTextEntry?: boolean;
  onChange: (value: string) => void;
}

export default function Input({
  value,
  onChange,
  placeholder = "",
  secureTextEntry = false,
}: InputProps) {
  return (
    <TextInput
      value={value}
      style={styles.input}
      onChangeText={onChange}
      placeholder={placeholder}
      secureTextEntry={secureTextEntry}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    height: 50,
    padding: 10,
    borderWidth: 1,
    borderRadius: 4,
    marginVertical: 4,
    borderColor: "#6c47ff",
    backgroundColor: "#fff",
  },
});
