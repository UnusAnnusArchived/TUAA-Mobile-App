import { ScrollView } from "react-native-gesture-handler";
import Layout from "../../components/layout";
import { IPageInfo } from "../../src/types";

const Register: React.FC<any> = ({ navigation }) => {
  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <Layout title={pageInfo.title} backButton backButtonAction={handleBack}>
      <ScrollView></ScrollView>
    </Layout>
  );
};

export default Register;

export const pageInfo: IPageInfo = {
  key: "register",
  title: "Register",
};
