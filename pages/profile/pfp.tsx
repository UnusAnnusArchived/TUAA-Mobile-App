// THIS IS NOT WORKING!
// Uploading a profile picture causes the `avatar` value to get changed to an empty string.
// Discussion: https://github.com/pocketbase/pocketbase/discussions/2002

import { StackScreenProps } from "@react-navigation/stack";
import { View } from "react-native";
import { Button, Divider, Text, ActivityIndicator, useTheme } from "react-native-paper";
import { useRecoilState } from "recoil";
import { ParamList } from ".";
import Avatar from "../../components/avatar";
import Layout from "../../components/layout";
import { userAtom } from "../../src/atoms";
import * as ImagePicker from "expo-image-picker";
import pb from "../../src/pocketbase";
import { Buffer } from "buffer";
import { useState } from "react";
import { IUser, IUserAtom } from "../../src/types";
import FormData from "form-data";

const ProfilePicture: React.FC<StackScreenProps<ParamList, "ProfilePicture">> = ({ navigation }) => {
  const [currentUser, setCurrentUser] = useRecoilState(userAtom);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const theme = useTheme();

  const handleBack = () => {
    navigation.goBack();
  };

  const handlePickPfp = async () => {
    setLoading(true);
    setError(false);
    try {
      await ImagePicker.getMediaLibraryPermissionsAsync(false);
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        aspect: [1, 1],
        quality: 1,
        base64: false,
        exif: false,
      });

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
    setLoading(true);
    setError(false);
    try {
      await ImagePicker.getCameraPermissionsAsync();
      let result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        aspect: [1, 1],
        quality: 1,
        base64: false,
        exif: false,
      });

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
          onPress={handlePickPfp}
          disabled={loading}
          style={{ marginTop: 8 }}
        >
          {loading ? <ActivityIndicator style={{ paddingTop: 5 }} /> : "Change Profile Picture"}
        </Button>
        <Button
          contentStyle={{
            backgroundColor: error ? theme.colors.errorContainer : theme.colors.elevation.level0,
          }}
          labelStyle={{
            color: error ? theme.colors.onErrorContainer : theme.colors.primary,
          }}
          mode="elevated"
          onPress={handleTakePfp}
          disabled={loading}
          style={{ marginTop: 8 }}
        >
          {loading ? <ActivityIndicator style={{ paddingTop: 5 }} /> : "From Camera"}
        </Button>
        {error && (
          <Text style={{ color: theme.colors.error, marginTop: 8 }}>
            There was an error setting your profile picture!
          </Text>
        )}
      </View>
    </Layout>
  );
};

export default ProfilePicture;
