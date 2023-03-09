import AsyncStorage from "@react-native-async-storage/async-storage";
import { StackScreenProps } from "@react-navigation/stack";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { ActivityIndicator, Button, Text } from "react-native-paper";
import Layout from "../../components/layout";
import Player from "../../components/player";
import VideoComments from "../../components/video-comments";
import VideoInfo from "../../components/video-info";
import { IEpisode, IPageInfo } from "../../src/types";
import { ParamList } from "../home";

const Watch: React.FC<StackScreenProps<ParamList, "Watch">> = ({ navigation, route }) => {
  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <Layout backButton backButtonAction={handleBack} title={route?.params?.episode?.title ?? pageInfo.title}>
      {route?.params?.episode ? (
        <ScrollView contentContainerStyle={{ margin: 16 }}>
          <View style={{ marginBottom: 32 }}>
            <Player episode={route.params.episode} />

            <VideoInfo episode={route.params.episode} />
            <VideoComments episode={route.params.episode} />
          </View>
        </ScrollView>
      ) : (
        <View style={{ justifyContent: "center", alignItems: "center", height: "100%" }}>
          <Text>Failed to load video!</Text>
          <Button style={{ marginTop: 8 }} mode="contained" onPress={handleBack}>
            Go Back
          </Button>
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
