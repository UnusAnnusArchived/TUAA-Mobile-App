import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator, StackScreenProps } from "@react-navigation/stack";
import { useMemo, useRef, useState } from "react";
import { ScrollView } from "react-native-gesture-handler";
import Layout from "../../components/layout";
import { IPageInfo } from "../../src/types";
import Register from "../register";
import pb from "../../src/pocketbase";
import { ActivityIndicator, Button, HelperText, IconButton, Text, TextInput } from "react-native-paper";
import { KeyboardAvoidingView, View, TextInput as RNTextInput } from "react-native";
import { emailReg, passwordReg, usernameReg } from "../../src/tools/regex";
import SuccessSnackbar from "./success-snackbar";
import ErrorSnackbar from "./error-snackbar";
export type ParamList = {
  Login: undefined;
  Register: { initialUsername: string; initialEmail: string; initialPassword: string };
};

const AuthNavigator: React.FC = () => {
  const Stack = createStackNavigator<ParamList>();

  return (
    <NavigationContainer independent>
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false, cardStyle: {} }}>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen
          name="Register"
          component={Register}
          initialParams={{ initialEmail: "", initialUsername: "", initialPassword: "" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AuthNavigator;

const Login: React.FC<StackScreenProps<ParamList, "Login">> = ({ navigation }) => {
  const [formValid, setFormValid] = useState(false);
  const [email, setEmail] = useState("");
  const [emailValid, setEmailValid] = useState(true);
  const emailRef = useRef<RNTextInput>(null);
  const [password, setPassword] = useState("");
  const [passwordValid, setPasswordValid] = useState(true);
  const passwordRef = useRef<RNTextInput>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<any>();
  const [showSuccessSnackbar, setShowSuccessSnackbar] = useState(false);
  const [showErrorSnackbar, setShowErrorSnackbar] = useState(false);
  const [loading, setLoading] = useState(false);

  useMemo(() => {
    setFormValid(emailValid && passwordValid);
  }, [emailValid, passwordValid]);

  const handleEmailChange = (value: string) => {
    setEmail(value);
    setEmailValid(!!value.match(emailReg) || !!value.match(usernameReg));
    error?.data?.data?.email && (error.data.data.email = undefined);
    setError(error);
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    setPasswordValid(!!value.match(passwordReg));
    error?.data?.data?.password && (error.data.data.password = undefined);
    setError(error);
  };

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async () => {
    if (formValid && !loading) {
      try {
        setLoading(true);
        await pb.collection("users").authWithPassword(email, password);
        setShowSuccessSnackbar(true);
        setLoading(false);
      } catch (err: any) {
        console.error(JSON.stringify(err, null, 2));
        setError(err);
        setShowErrorSnackbar(true);
        setLoading(false);
        if (err?.data?.data?.identity) {
          setEmailValid(false);
        }
        if (err?.data?.data?.password) {
          setPasswordValid(false);
        }
      }
    }
  };

  return (
    <Layout title={pageInfo.title}>
      <KeyboardAvoidingView behavior="padding">
        <ScrollView
          style={{ height: "100%" }}
          contentContainerStyle={{
            flexDirection: "column",
            justifyContent: "center",
            alignContent: "center",
            flex: 1,
            paddingHorizontal: 16,
          }}
          keyboardDismissMode="interactive"
        >
          <TextInput
            autoComplete="email"
            autoCorrect={false}
            ref={emailRef}
            disabled={loading}
            error={!emailValid}
            autoCapitalize="none"
            returnKeyType="next"
            onSubmitEditing={() => {
              passwordRef.current?.focus();
            }}
            keyboardType="email-address"
            label="Username or Email"
            value={email}
            onChangeText={handleEmailChange}
          />
          <HelperText type="error" visible={error?.data?.data?.identity?.message}>
            {error?.data?.data?.identity?.message}
          </HelperText>
          <TextInput
            autoComplete="password"
            autoCorrect={false}
            ref={passwordRef}
            disabled={loading}
            error={!passwordValid}
            returnKeyType="go"
            onSubmitEditing={handleSubmit}
            keyboardType="default"
            secureTextEntry={!showPassword}
            label="Password"
            value={password}
            onChangeText={handlePasswordChange}
            right={<TextInput.Icon icon={showPassword ? "eye-off" : "eye"} onPress={handleShowPassword} />}
          />
          <HelperText type="error" visible={error?.data?.data?.password?.message}>
            {error?.data?.data?.password?.message}
          </HelperText>
          <View style={{ flexDirection: "row" }}>
            <Button
              disabled={loading}
              mode="elevated"
              style={{ marginTop: 16 }}
              onPress={() => {
                navigation.navigate("Register", {
                  initialEmail: email.match(emailReg) ? email : "",
                  initialUsername: email.match(emailReg) ? "" : email,
                  initialPassword: password,
                });
              }}
            >
              Register
            </Button>
            <View style={{ flex: 1 }} />
            <Button disabled={!formValid || loading} mode="contained" style={{ marginTop: 16 }} onPress={handleSubmit}>
              {loading ? <ActivityIndicator /> : "Login"}
            </Button>
          </View>
        </ScrollView>
        <SuccessSnackbar open={showSuccessSnackbar} setOpen={setShowSuccessSnackbar} />
        <ErrorSnackbar
          open={showErrorSnackbar}
          setOpen={setShowErrorSnackbar}
          error={error?.data?.message ?? "An unknown error has occurred!"}
        />
      </KeyboardAvoidingView>
    </Layout>
  );
};

export const pageInfo: IPageInfo = {
  key: "login",
  title: "Login",
  focusedIcon: "login",
};
