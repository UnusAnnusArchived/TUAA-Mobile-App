import { Text } from "react-native-paper";
import Layout from "../../components/layout";
import type { IPageInfo } from "../../src/types";

const Profile: React.FC = () => {
  return (
    <Layout title={pageInfo.title}>
      <Text>Profile</Text>
    </Layout>
  );
};

export default Profile;

export const pageInfo: IPageInfo = {
  key: "profile",
  title: "Profile",
  focusedIcon: "account",
};
