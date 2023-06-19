import { Card, Text, useTheme } from "react-native-paper";
import { cdn } from "../../src/endpoints";
import { IDownloadedEpisode, IEpisode } from "../../src/types";
import moment from "moment-with-locales-es6";
import React from "react";
import { Image, useWindowDimensions, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import useDeviceType from "../../src/tools/useDeviceType";
import { DeviceType } from "expo-device";
import { StackNavigationProp } from "@react-navigation/stack";
import { ParamList } from "../../pages/home";

interface IProps {
  episode: IEpisode | IDownloadedEpisode;
  navigation: StackNavigationProp<ParamList, "Videos">;
}

const Episode: React.FC<IProps> = ({ episode, navigation }) => {
  const theme = useTheme();
  const deviceType = useDeviceType();
  const dimensions = useWindowDimensions();

  const handlePress = async () => {
    navigation.navigate("Watch", { episode });
  };

  return (
    <View
      style={{
        width: deviceType !== DeviceType.PHONE ? (1 / 3) * dimensions.width - 16 : undefined,
      }}
    >
      <Card style={{ margin: 8, width: dimensions.width - 32 }} onPress={handlePress}>
        <Card.Cover
          alt={`Thumbnail for episode ${episode.episode}`}
          style={{ backgroundColor: theme.colors.elevation.level2 }}
          source={{
            uri: `${cdn}${
              "posters" in episode
                ? episode.posters![0]?.src
                : "thumbnail" in episode
                ? episode?.thumbnail
                : "downloadedSource" in episode
                ? episode.downloadedSource
                : undefined
            }`,
            width: 1280,
            height: 720,
          }}
          accessibilityIgnoresInvertColors
        />
        <Card.Content style={{ marginTop: 16 }}>
          <Text variant="titleMedium">{episode.title}</Text>
          <Text>
            Episode {episode.episode} -{" "}
            {moment("date" in episode ? episode.date : episode.releasedate).format("DD. MMM YYYY")}
          </Text>
        </Card.Content>
      </Card>
    </View>
  );
};

export default Episode;
