import { StackScreenProps } from "@react-navigation/stack";
import { View } from "react-native";
import { Button, Divider, Text, ActivityIndicator, useTheme, List } from "react-native-paper";
import { useRecoilState } from "recoil";
import { ParamList } from ".";
import Avatar from "../../components/avatar";
import Layout from "../../components/layout";
import { userAtom } from "../../src/atoms";
import * as ImagePicker from "expo-image-picker";
import pb from "../../src/pocketbase";
import { Buffer } from "buffer";
import { useEffect, useRef, useState } from "react";
import { IUser, IUserAtom } from "../../src/types";
import FormData from "form-data";
import DeviceInfo, { useIsEmulator } from "react-native-device-info";
import BottomSheet from "react-native-raw-bottom-sheet";

const ProfilePicture: React.FC<StackScreenProps<ParamList, "ProfilePicture">> = ({ navigation }) => {
  const [currentUser, setCurrentUser] = useRecoilState(userAtom);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const isEmulator = useIsEmulator().result;
  const sheetRef = useRef<BottomSheet>(null);
  const theme = useTheme();

  const handleBack = () => {
    navigation.goBack();
  };

  const handlePickPfp = async () => {
    setLoading(true);
    setError(false);
    try {
      await ImagePicker.requestMediaLibraryPermissionsAsync(false);
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
        base64: false,
        exif: false,
      });
      sheetRef.current?.close();

      if (!result.canceled && result.assets[0].uri) {
        const data = new FormData();

        data.append("avatar", {
          uri: result.assets[0].uri,
          type: "image/*",
          name: result.assets[0].fileName ?? result.assets[0].uri.split("/").at(-1),
        });

        await pb.collection("users").update<IUser>(currentUser?.model?.id ?? "", data);
      }
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError(true);
      console.error(err);
    }
  };

  const handleTakePfp = async () => {
    if (isEmulator) {
      return console.error("Camera not available on emulator/simulator!");
    }
    setLoading(true);
    setError(false);
    try {
      await ImagePicker.requestCameraPermissionsAsync();
      let result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
        base64: false,
        exif: false,
      });
      sheetRef.current?.close();

      if (!result.canceled && result.assets[0].uri) {
        const data = new FormData();

        data.append("avatar", {
          uri: result.assets[0].uri,
          type: "image/*",
          name: result.assets[0].fileName ?? result.assets[0].uri.split("/").at(-1),
        });

        await pb.collection("users").update<IUser>(currentUser?.model?.id ?? "", data);
      }
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError(true);
      console.error(err);
    }
  };

  return (
    <Layout title="Profile Picture" backButton backButtonAction={handleBack}>
      <View style={{ alignItems: "center", marginTop: 8 }}>
        <Text variant="titleLarge" style={{ marginBottom: 8 }}>
          Current Profile Picture
        </Text>
        <Avatar user={currentUser.model} size={72} />
        <Button
          contentStyle={{
            backgroundColor: error ? theme.colors.errorContainer : theme.colors.elevation.level0,
          }}
          labelStyle={{
            color: error ? theme.colors.onErrorContainer : theme.colors.primary,
          }}
          mode="elevated"
          onPress={() => {
            sheetRef.current?.open();
          }}
          disabled={loading}
          style={{ marginTop: 8 }}
        >
          {loading ? <ActivityIndicator style={{ paddingTop: 5 }} /> : "Change Profile Picture"}
        </Button>
        {error && (
          <Text style={{ color: theme.colors.error, marginTop: 8 }}>
            There was an error setting your profile picture!
          </Text>
        )}
      </View>
      {/* @ts-ignore TODO: create proper types for this library */}
      <BottomSheet
        height={200}
        closeOnDragDown
        customStyles={{
          draggableIcon: { backgroundColor: theme.colors.onSurfaceVariant },
          container: { backgroundColor: theme.colors.elevation.level1 },
        }}
        ref={sheetRef}
      >
        <View style={{ padding: 12 }}>
          <Text variant="titleSmall">Change Profile Picture With</Text>
          <List.Section>
            <List.Item
              style={{ padding: 8 }}
              titleStyle={{ color: isEmulator ? theme.colors.onSurfaceDisabled : theme.colors.onSurface }}
              left={() => <List.Icon color={isEmulator ? theme.colors.onSurfaceDisabled : undefined} icon="camera" />}
              right={() => (
                <List.Icon color={isEmulator ? theme.colors.onSurfaceDisabled : undefined} icon="menu-right" />
              )}
              title="Camera"
              onPress={handleTakePfp}
            />
            <Divider />
            <List.Item
              style={{ padding: 8 }}
              left={() => <List.Icon icon="image-multiple" />}
              right={() => <List.Icon icon="menu-right" />}
              title="Photo Library"
              onPress={handlePickPfp}
            />
          </List.Section>
        </View>
      </BottomSheet>
    </Layout>
  );
};

export default ProfilePicture;
