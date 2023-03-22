import { StackScreenProps } from "@react-navigation/stack";
import { useWindowDimensions, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { Button, DataTable, Dialog, Portal, Text } from "react-native-paper";
import { useRecoilState } from "recoil";
import { ParamList } from ".";
import Layout from "../../components/layout";
import { userAtom } from "../../src/atoms";
import moment from "moment-with-locales-es6";
import { useState } from "react";
import JSONData from "../../components/profile-json-data";

const AccountInformation: React.FC<StackScreenProps<ParamList, "AccountInformation">> = ({ navigation }) => {
  const [showJSONDialog, setShowJSONDialog] = useState(false);
  const [currentUser] = useRecoilState(userAtom);
  const dimensions = useWindowDimensions();

  const handleBack = () => {
    navigation.goBack();
  };

  const showJSONData = () => {
    setShowJSONDialog(true);
  };

  return (
    <Layout title="Account Information" backButton backButtonAction={handleBack}>
      <ScrollView contentContainerStyle={{ alignItems: "center", marginTop: 8 }}>
        <ScrollView style={{ width: "100%" }} contentContainerStyle={{ alignItems: "center" }} horizontal>
          <DataTable style={{ minWidth: dimensions.width }}>
            <DataTable.Row>
              <DataTable.Title>Name</DataTable.Title>
              <DataTable.Cell>{currentUser.model?.name}</DataTable.Cell>
            </DataTable.Row>
            <DataTable.Row>
              <DataTable.Title>Username</DataTable.Title>
              <DataTable.Cell>{currentUser.model?.username}</DataTable.Cell>
            </DataTable.Row>
            <DataTable.Row>
              <DataTable.Title>Email</DataTable.Title>
              <DataTable.Cell>{currentUser.model?.email}</DataTable.Cell>
            </DataTable.Row>
            <DataTable.Row>
              <DataTable.Title>User ID</DataTable.Title>
              <DataTable.Cell>{currentUser.model?.id}</DataTable.Cell>
            </DataTable.Row>
            <DataTable.Row>
              <DataTable.Title>Created</DataTable.Title>
              <DataTable.Cell>
                {moment.utc(currentUser.model?.created).fromNow()} (
                {moment.utc(currentUser.model?.created).local().format("MM/DD/YYYY HH:mm:ss")})
              </DataTable.Cell>
            </DataTable.Row>
            {currentUser.model?.isAdmin && (
              <DataTable.Row>
                <DataTable.Title>Is Admin</DataTable.Title>
                <DataTable.Cell>True</DataTable.Cell>
              </DataTable.Row>
            )}
          </DataTable>
        </ScrollView>
        <Button mode="contained" style={{ marginTop: 8 }} onPress={showJSONData}>
          View Raw Profile Data
        </Button>
      </ScrollView>
      <JSONData show={showJSONDialog} setShow={setShowJSONDialog} />
    </Layout>
  );
};

export default AccountInformation;
