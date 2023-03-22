import { StackScreenProps } from "@react-navigation/stack";
import { useState } from "react";
import { View } from "react-native";
import { Button, Text } from "react-native-paper";
import { useRecoilState } from "recoil";
import { ParamList } from ".";
import Layout from "../../components/layout";
import ResetEmailDialog from "../../components/reset-email-dialog";
import { userAtom } from "../../src/atoms";
import pb from "../../src/pocketbase";

const AccountActions: React.FC<StackScreenProps<ParamList, "Actions">> = ({ navigation }) => {
  const [showEmailResetDialog, setShowEmailResetDialog] = useState(false);
  const [sentPasswordReset, setSentPasswordReset] = useState(false);
  const [currentUser] = useRecoilState(userAtom);

  const handleBack = () => {
    navigation.goBack();
  };

  const handleShowEmailResetDialog = () => {
    setShowEmailResetDialog(true);
  };

  const handleSendPasswordReset = async () => {
    await pb.collection("users").requestPasswordReset(currentUser?.model?.email ?? "");
    setSentPasswordReset(true);
  };

  return (
    <Layout title="Account Actions" backButton backButtonAction={handleBack}>
      <View style={{ alignItems: "center", marginTop: 8 }}>
        <Text variant="titleLarge">Reset</Text>
        <Button mode="elevated" onPress={handleShowEmailResetDialog} style={{ marginTop: 8 }}>
          Send Email Reset
        </Button>
        <Button mode="elevated" onPress={handleSendPasswordReset} style={{ marginTop: 8 }}>
          Send Password Reset
        </Button>
      </View>
      <ResetEmailDialog open={showEmailResetDialog} setOpen={setShowEmailResetDialog} />
    </Layout>
  );
};

export default AccountActions;
