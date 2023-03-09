import { StackScreenProps } from "@react-navigation/stack";
import { View } from "react-native";
import { Text } from "react-native-paper";
import { ParamList } from ".";
import Layout from "../../components/layout";

const AccountActions: React.FC<StackScreenProps<ParamList, "Actions">> = ({ navigation }) => {
  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <Layout title="Account Actions" backButton backButtonAction={handleBack}>
      <View style={{ alignItems: "center", marginTop: 8 }}>
        <Text>asdf</Text>
      </View>
    </Layout>
  );
};

export default AccountActions;
