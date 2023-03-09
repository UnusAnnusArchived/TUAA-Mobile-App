import { StackScreenProps } from "@react-navigation/stack";
import { View } from "react-native";
import { Switch, Text } from "react-native-paper";
import { useRecoilState } from "recoil";
import { ParamList } from ".";
import Layout from "../../components/layout";
import SwitchWithLabel from "../../components/switch-with-label";
import { userAtom } from "../../src/atoms";
import pb from "../../src/pocketbase";

const EmailPreferences: React.FC<StackScreenProps<ParamList, "EmailPreferences">> = ({ navigation }) => {
  const [currentUser] = useRecoilState(userAtom);

  const handleBack = () => {
    navigation.goBack();
  };

  const handleAccountChange = (value: boolean) => {
    if (currentUser.model?.id) {
      pb.collection("users").update(currentUser.model.id, { emails_account: value });
    }
  };

  const handleUpdatesChange = (value: boolean) => {
    if (currentUser.model?.id) {
      pb.collection("users").update(currentUser.model.id, { emails_updates: value });
    }
  };

  return (
    <Layout title="Email Preferences" backButton backButtonAction={handleBack}>
      <View style={{ alignItems: "center", marginTop: 8 }}>
        <SwitchWithLabel
          label="Account Updates"
          value={currentUser.model?.emails_account}
          onValueChange={handleAccountChange}
          style={{ marginBottom: 4 }}
        />
        <SwitchWithLabel
          label="Website Updates"
          value={currentUser.model?.emails_updates}
          onValueChange={handleUpdatesChange}
          style={{ marginTop: 4 }}
        />
      </View>
    </Layout>
  );
};

export default EmailPreferences;
