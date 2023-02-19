import { Card, Text, useTheme } from "react-native-paper";
import { cdn } from "../../src/endpoints";
import { IEpisode } from "../../src/types";
import moment from "moment-with-locales-es6";
import React from "react";
import { Image, useWindowDimensions, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import useDeviceType from "../../src/tools/useDeviceType";
import { DeviceType } from "expo-device";

interface IProps {
  episode: IEpisode;
  navigation: any;
}

const Episode: React.FC<IProps> = ({ episode, navigation }) => {
  const theme = useTheme();
  const deviceType = useDeviceType();
  const dimensions = useWindowDimensions();

  const handlePress = async () => {
    await AsyncStorage.setItem("selected-video", JSON.stringify(episode));
    navigation.navigate("Watch");
  };

  return (
    <View
      style={{
        width: deviceType !== DeviceType.PHONE ? (1 / 3) * dimensions.width - 16 : undefined,
      }}
    >
      <Card style={{ margin: 8 }} onPress={handlePress}>
        <Card.Cover
          alt={`Thumbnail for episode ${episode.episode}`}
          style={{ backgroundColor: theme.colors.elevation.level2 }}
          source={{ uri: `${cdn}${episode?.posters?.[1]?.src ?? episode?.thumbnail}`, width: 1280, height: 1280 }}
          accessibilityIgnoresInvertColors
        />
        <Card.Content style={{ marginTop: 16 }}>
          <Text variant="titleMedium">{episode.title}</Text>
          <Text>
            Episode {episode.episode} - {moment(episode.date ?? episode.releasedate).format("DD. MMM YYYY")}
          </Text>
        </Card.Content>
      </Card>
    </View>
  );
};

export default Episode;
