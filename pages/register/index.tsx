import { useMemo, useState } from "react";
import { ScrollView } from "react-native-gesture-handler";
import Layout from "../../components/layout";
import { IPageInfo } from "../../src/types";
import pb from "../../src/pocketbase";
import { ActivityIndicator, Button, HelperText, TextInput } from "react-native-paper";
import { KeyboardAvoidingView, View } from "react-native";
import { StackScreenProps } from "@react-navigation/stack";
import { ParamList } from "../login";
import { emailReg, nameReg, passwordReg, usernameReg } from "../../src/tools/regex";
import CreatedSnackbar from "./created-snackbar";
import ErrorSnackbar from "./error-snackbar";

const Register: React.FC<StackScreenProps<ParamList, "Register">> = ({ navigation, route }) => {
  const [formValid, setFormValid] = useState(false);
  const [email, setEmail] = useState(route.params.initialEmail);
  const [emailValid, setEmailValid] = useState(true);
  const [name, setName] = useState("");
  const [nameValid, setNameValid] = useState(true);
  const [username, setUsername] = useState(route.params.initialUsername);
  const [usernameValid, setUsernameValid] = useState(true);
  const [password, setPassword] = useState(route.params.initialPassword);
  const [passwordValid, setPasswordValid] = useState(true);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmPasswordValid, setConfirmPasswordValid] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<any>();
  const [showCreatedSnackbar, setShowCreatedSnackbar] = useState(false);
  const [showErrorSnackbar, setShowErrorSnackbar] = useState(false);
  const [loading, setLoading] = useState(false);

  useMemo(() => {
    setFormValid(emailValid && nameValid && usernameValid && passwordValid && confirmPasswordValid);
  }, [emailValid, nameValid, usernameValid, passwordValid, confirmPasswordValid]);

  const handleBack = () => {
    navigation.goBack();
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    setEmailValid(!!value.match(emailReg));
    error?.data?.data?.email && (error.data.data.email = undefined);
    setError(error);
  };

  const handleNameChange = (value: string) => {
    setName(value);
    setNameValid(!!value.match(nameReg));
    error?.data?.data?.name && (error.data.data.name = undefined);
    setError(error);
  };

  const handleUsernameChange = (value: string) => {
    setUsername(value);
    setUsernameValid(!!value.match(usernameReg));
    error?.data?.data?.username && (error.data.data.username = undefined);
    setError(error);
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    setPasswordValid(!!value.match(passwordReg));
    setConfirmPasswordValid(value === confirmPassword);
    error?.data?.data?.password && (error.data.data.password = undefined);
    setError(error);
  };

  const handleConfirmPasswordChange = (value: string) => {
    setConfirmPassword(value);
    setConfirmPasswordValid(!!value.match(passwordReg) && value === password);
    error?.data?.data?.paswordConfirm && (error.data.data.paswordConfirm = undefined);
    setError(error);
  };

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await pb.collection("users").create({
        email,
        name,
        username,
        password,
        passwordConfirm: confirmPassword,
        emails_account: true,
        emails_updates: false,
      });
      setShowCreatedSnackbar(true);
      await pb.collection("users").authWithPassword(username, password);
      setLoading(false);
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
      setError(err);
      setShowErrorSnackbar(true);
      setLoading(false);
      if (err?.data?.data?.email) {
        setEmailValid(false);
      }
      if (err?.data?.data?.name) {
        setNameValid(false);
      }
      if (err?.data?.data?.username) {
        setUsernameValid(false);
      }
      if (err?.data?.data?.password) {
        setPasswordValid(false);
      }
      if (err?.data?.data?.passwordConfirm) {
        setPasswordValid(false);
      }
    }
  };

  return (
    <Layout title={pageInfo.title} backButton backButtonAction={handleBack}>
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
            disabled={loading}
            error={!emailValid}
            keyboardType="email-address"
            label="Email"
            value={email}
            onChangeText={handleEmailChange}
          />
          <HelperText type="error" visible={error?.data?.data?.email?.message}>
            {error?.data?.data?.email?.message}
          </HelperText>
          <TextInput disabled={loading} error={!nameValid} label="Name" value={name} onChangeText={handleNameChange} />
          <HelperText type="error" visible={error?.data?.data?.name?.message}>
            {error?.data?.data?.name?.message}
          </HelperText>
          <TextInput
            disabled={loading}
            error={!usernameValid}
            label="Username"
            value={username}
            onChangeText={handleUsernameChange}
          />
          <HelperText type="error" visible={error?.data?.data?.username?.message}>
            {error?.data?.data?.username?.message}
          </HelperText>
          <TextInput
            disabled={loading}
            error={!passwordValid}
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
          <TextInput
            disabled={loading}
            error={!confirmPasswordValid}
            keyboardType="default"
            secureTextEntry={!showPassword}
            label="Confirm Password"
            value={confirmPassword}
            onChangeText={handleConfirmPasswordChange}
            right={<TextInput.Icon icon={showPassword ? "eye-off" : "eye"} onPress={handleShowPassword} />}
          />
          <HelperText type="error" visible={error?.data?.data?.passwordConfirm?.message}>
            {error?.data?.data?.passwordConfirm?.message}
          </HelperText>
          <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
            <Button disabled={!formValid || loading} mode="contained" style={{ marginTop: 16 }} onPress={handleSubmit}>
              {loading ? <ActivityIndicator /> : "Register"}
            </Button>
          </View>
        </ScrollView>
        <CreatedSnackbar open={showCreatedSnackbar} setOpen={setShowCreatedSnackbar} />
        <ErrorSnackbar
          open={showErrorSnackbar}
          setOpen={setShowErrorSnackbar}
          error={error?.data?.message ?? "An unknown error has occurred!"}
        />
      </KeyboardAvoidingView>
    </Layout>
  );
};

export default Register;

export const pageInfo: IPageInfo = {
  key: "register",
  title: "Register",
};
