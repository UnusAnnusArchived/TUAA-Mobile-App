import { Text } from "react-native-paper";
import Layout from "../../components/layout";
import type { IPageInfo } from "../../src/types";

const Settings: React.FC = () => {
  return (
    <Layout title={pageInfo.title}>
      <Text>Settings</Text>
    </Layout>
  );
};

export default Settings;

export const pageInfo: IPageInfo = {
  key: "settings",
  title: "Settings",
  focusedIcon: "cog",
};
