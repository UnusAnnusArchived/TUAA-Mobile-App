import { Text } from "react-native-paper";
import Layout from "../../components/layout";
import useDeviceType from "../../tools/useDeviceType";
import type { IPageInfo } from "../../types";

const Profile: React.FC = () => {
  const deviceType = useDeviceType();

  return (
    <Layout title={pageInfo.title}>
      <Text>Device Type: {deviceType}</Text>
    </Layout>
  );
};

export default Profile;

export const pageInfo: IPageInfo = {
  key: "debug",
  title: "Debug",
  focusedIcon: "bug",
};
