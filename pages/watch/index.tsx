import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { ActivityIndicator, Button, Text } from "react-native-paper";
import Layout from "../../components/layout";
import VideoComments from "../../components/video-comments";
import VideoInfo from "../../components/video-info";
import { IEpisode, IPageInfo } from "../../src/types";

const Watch: React.FC<any> = ({ navigation }) => {
  const [episode, setEpisode] = useState<IEpisode>();
  const [error, setError] = useState<boolean>();

  useEffect(() => {
    fetchVideo();
  }, []);

  const fetchVideo = async () => {
    setEpisode(undefined);
    setError(undefined);

    try {
      const episode = JSON.parse(
        (await AsyncStorage.getItem("selected-video")) ?? setError(true) ?? '{"title": "error"}'
      );
      setEpisode(episode);
    } catch {
      setError(true);
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <Layout backButton backButtonAction={handleBack} title={episode?.title ?? pageInfo.title}>
      {episode ? (
        <ScrollView contentContainerStyle={{ margin: 16 }}>
          <View style={{ marginBottom: 32 }}>
            {/* Future video player */}
            <View style={{ aspectRatio: 16 / 9, backgroundColor: "#000000" }} accessibilityIgnoresInvertColors></View>

            <VideoInfo episode={episode} />
            <VideoComments episode={episode} />
          </View>
        </ScrollView>
      ) : (
        <View style={{ justifyContent: "center", alignItems: "center", height: "100%" }}>
          {error ? (
            <>
              <Text>Failed to load video!</Text>
              <Button style={{ marginTop: 8 }} mode="contained" onPress={fetchVideo}>
                Retry
              </Button>
            </>
          ) : (
            <ActivityIndicator />
          )}
        </View>
      )}
    </Layout>
  );
};

export default Watch;

export const pageInfo: IPageInfo = {
  key: "watch",
  title: "Watch",
};
