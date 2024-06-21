import {
  Input,
  VStack,
  Button,
  ButtonText,
  InputField,
  FormControl,
  FormControlLabel,
  FormControlLabelText,
} from "@gluestack-ui/themed";
import { useState } from "react";
import { useSignIn } from "@clerk/clerk-expo";
import { StyleSheet, View } from "react-native";

import Page from "@/components/Page";

export default function LoginPage() {
  const { signIn, setActive, isLoaded } = useSignIn();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onSignInPress = async () => {
    if (!isLoaded) {
      return;
    }
    setLoading(true);
    try {
      const completeSignIn = await signIn.create({
        identifier: email,
        password,
      });
      await setActive({ session: completeSignIn.createdSessionId });
    } catch (err: any) {
      console.log(err.errors);

      alert(err.errors[0].message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Page>
      <View style={styles.loginForm}>
        {/* <LinearGradient colors={["#6c47ff", "white"]} style={styles.background} /> */}
        <VStack space="md" style={styles.formContainer}>
          <FormControl size="md" isDisabled={loading}>
            <FormControlLabel mb="$1">
              <FormControlLabelText>Email</FormControlLabelText>
            </FormControlLabel>
            <Input>
              <InputField
                type="text"
                value={email}
                placeholder="Email"
                autoCapitalize="none"
                $focus-borderWidth={1}
                onChangeText={setEmail}
                $focus-borderColor="#6c47ff"
                defaultValue="test@gmail.com"
              />
            </Input>
          </FormControl>
          <FormControl size="md" isDisabled={loading}>
            <FormControlLabel mb="$1">
              <FormControlLabelText>Password</FormControlLabelText>
            </FormControlLabel>
            <Input>
              <InputField
                size="md"
                type="password"
                autoCapitalize="none"
                placeholder="Password"
                $focus-borderWidth={1}
                onChangeText={setPassword}
                $focus-borderColor="#6c47ff"
              />
            </Input>
          </FormControl>
        </VStack>

        <Button
          size="md"
          bgColor="#6c47ff"
          disabled={loading}
          onPress={onSignInPress}
          style={{ marginBottom: 48 }}
        >
          <ButtonText>Ingresar </ButtonText>
        </Button>
      </View>
    </Page>
  );
}

const styles = StyleSheet.create({
  background: {
    top: 0,
    left: 0,
    right: 0,
    height: "100%",
    position: "absolute",
  },
  loginForm: {
    flex: 1,
    width: "100%",
    paddingHorizontal: 16,
    marginVertical: "auto",
    marginHorizontal: "auto",
    justifyContent: "space-between",
  },
  formContainer: {
    flex: 1,
    justifyContent: "center",
  },
});
