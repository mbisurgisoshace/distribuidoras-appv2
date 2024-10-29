import { KeyboardTypeOptions, StyleSheet, TextInput } from "react-native";

interface InputProps {
  style?: any;
  value: string;
  placeholder?: string;
  secureTextEntry?: boolean;
  onChange: (value: string) => void;
  keyboardType?: KeyboardTypeOptions;
}

export default function Input({
  value,
  style,
  onChange,
  placeholder = "",
  keyboardType = "default",
  secureTextEntry = false,
}: InputProps) {
  return (
    <TextInput
      value={value}
      style={{
        ...styles.input,
        ...style,
      }}
      onChangeText={onChange}
      placeholder={placeholder}
      keyboardType={keyboardType}
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
