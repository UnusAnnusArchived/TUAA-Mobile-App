import { Button, Divider, IconButton, List, Surface, Text, useTheme } from "react-native-paper";
import Layout from "../../components/layout";
import { IPageInfo, IUser } from "../../src/types";
import pb from "../../src/pocketbase";
import { View } from "react-native";
import { createStackNavigator, StackScreenProps } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { ScrollView } from "react-native-gesture-handler";
import { useRecoilState } from "recoil";
import { userAtom } from "../../src/atoms";
import Avatar from "../../components/avatar";
import ProfilePicture from "./pfp";
import EmailPreferences from "./email-preferences";
import AccountInformation from "./account-information";
import AccountActions from "./actions";
import DeleteAccountDialog from "../../components/delete-account-dialog";
import { useState } from "react";

export type ParamList = {
  Profile: undefined;
  AccountInformation: undefined;
  ProfilePicture: undefined;
  EmailPreferences: undefined;
  Actions: undefined;
};

const ProfileRouter: React.FC = () => {
  const Stack = createStackNavigator<ParamList>();

  return (
    <NavigationContainer independent>
      <Stack.Navigator initialRouteName="Profile" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen name="AccountInformation" component={AccountInformation} />
        <Stack.Screen name="ProfilePicture" component={ProfilePicture} />
        <Stack.Screen name="EmailPreferences" component={EmailPreferences} />
        <Stack.Screen name="Actions" component={AccountActions} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default ProfileRouter;

const Profile: React.FC<StackScreenProps<ParamList, "Profile">> = ({ navigation }) => {
  const [showDeleteAccountDialog, setShowDeleteAccountDialog] = useState(false);
  const [user, setUser] = useRecoilState(userAtom);
  const theme = useTheme();

  const handleLogout = async () => {
    pb.authStore.clear();
  };

  const handleShowDeleteAccountDialog = () => {
    setShowDeleteAccountDialog(true);
  };

  return (
    <Layout title={pageInfo.title}>
      <ScrollView>
        <Surface elevation={1}>
          <List.Item
            style={{ paddingHorizontal: 16, paddingVertical: 26 }}
            left={() => <Avatar user={user.model} margin={0} />}
            right={() => <IconButton icon="menu-right" />}
            title={user?.model?.name}
            description={user?.model?.email}
            onPress={() => {
              navigation.navigate("AccountInformation");
            }}
          />
          <Surface elevation={2} style={{ paddingVertical: 4 }}>
            <List.Item
              style={{ padding: 16 }}
              left={() => <List.Icon icon="account-circle" />}
              right={() => <IconButton icon="menu-right" />}
              title="Profile Picture"
              description="Modify your account's profile picture"
              onPress={() => {
                navigation.navigate("ProfilePicture");
              }}
            />
            <Divider />
            <List.Item
              style={{ padding: 16 }}
              left={() => <List.Icon icon="email" />}
              right={() => <IconButton icon="menu-right" />}
              title="Email Preferences"
              description="Modify which emails you receive"
              onPress={() => {
                navigation.navigate("EmailPreferences");
              }}
            />
            <Divider />
            <List.Item
              style={{ padding: 16 }}
              left={() => <List.Icon icon="account-details" />}
              right={() => <IconButton icon="menu-right" />}
              title="Account Actions"
              description="Make any actions to your account"
              onPress={() => {
                navigation.navigate("Actions");
              }}
            />
          </Surface>
          <Surface elevation={2} style={{ marginTop: 32, paddingVertical: 4 }}>
            <List.Item
              style={{ padding: 16 }}
              left={() => <List.Icon icon="logout" />}
              title="Logout"
              description="Logout of your account"
              onPress={handleLogout}
            />
            <Divider />
            <List.Item
              style={{ padding: 16 }}
              titleStyle={{ color: theme.colors.error }}
              descriptionStyle={{ color: theme.colors.error }}
              left={() => <List.Icon color={theme.colors.error} icon="delete" />}
              title="Delete"
              description="Delete your account"
              onPress={handleShowDeleteAccountDialog}
            />
          </Surface>
        </Surface>
      </ScrollView>
      <DeleteAccountDialog open={showDeleteAccountDialog} setOpen={setShowDeleteAccountDialog} />
    </Layout>
  );
};

export const pageInfo: IPageInfo = {
  key: "profile",
  title: "Profile",
  focusedIcon: "account",
};
