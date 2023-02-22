import { Button, Text } from "react-native-paper";
import Layout from "../../components/layout";
import type { IPageInfo } from "../../src/types";
import pb from "../../src/pocketbase";

const Profile: React.FC = () => {
  const logout = () => {
    pb.authStore.clear();
  };

  return (
    <Layout title={pageInfo.title}>
      <Text>Profile</Text>
      <Button onPress={logout}>Logout</Button>
    </Layout>
  );
};

export default Profile;

export const pageInfo: IPageInfo = {
  key: "profile",
  title: "Profile",
  focusedIcon: "account",
};
