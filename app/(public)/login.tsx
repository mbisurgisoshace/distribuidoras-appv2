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
                onChangeText={setEmail}
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
                type="password"
                autoCapitalize="none"
                placeholder="Password"
                onChangeText={setPassword}
              />
            </Input>
          </FormControl>
        </VStack>

        <Button onPress={onSignInPress} disabled={loading} size="sm">
          <ButtonText>Ingresar </ButtonText>
        </Button>
      </View>
    </Page>
  );
}

const styles = StyleSheet.create({
  loginForm: {
    flex: 1,
    width: "80%",
    marginVertical: "auto",
    marginHorizontal: "auto",
    justifyContent: "space-between",
  },
  formContainer: {
    flex: 1,
    justifyContent: "center",
  },
});
