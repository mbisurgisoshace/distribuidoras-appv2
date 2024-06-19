import { SafeAreaView, StyleSheet } from "react-native";

interface PageProps {
  children: React.ReactNode;
}

export default function Page({ children }: PageProps) {
  return <SafeAreaView style={styles.container}>{children}</SafeAreaView>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});
