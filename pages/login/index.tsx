import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { useState } from "react";
import { ScrollView } from "react-native-gesture-handler";
import Layout from "../../components/layout";
import { IPageInfo } from "../../src/types";
import Register from "../register";
import pb from "../../src/pocketbase";
import { Button, IconButton, Text, TextInput } from "react-native-paper";
import { View } from "react-native";

const AuthNavigator: React.FC = () => {
  const Stack = createStackNavigator();

  return (
    <NavigationContainer independent>
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false, cardStyle: {} }}>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Register" component={Register} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AuthNavigator;

const Login: React.FC<any> = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async () => {
    await pb.collection("users").authWithPassword(email, password);
  };

  return (
    <Layout title={pageInfo.title}>
      <View
        style={{
          flexDirection: "column",
          justifyContent: "center",
          alignContent: "center",
          flex: 1,
          paddingHorizontal: 16,
        }}
      >
        <TextInput keyboardType="email-address" label="Username or Email" value={email} onChangeText={setEmail} />
        <TextInput
          keyboardType="default"
          theme={{ roundness: 0 }}
          secureTextEntry={!showPassword}
          label="Password"
          value={password}
          onChangeText={setPassword}
          right={<TextInput.Icon icon={showPassword ? "eye-off" : "eye"} onPress={handleShowPassword} />}
        />
        <Button mode="contained" style={{ marginTop: 16 }} onPress={handleSubmit}>
          Login
        </Button>
        <Text
          style={{ textAlign: "center", marginTop: 16, textDecorationLine: "underline" }}
          onPress={() => {
            navigation.navigate("Register");
          }}
        >
          Don't have an account?
        </Text>
      </View>
    </Layout>
  );
};

export const pageInfo: IPageInfo = {
  key: "login",
  title: "Login",
  focusedIcon: "login",
};
