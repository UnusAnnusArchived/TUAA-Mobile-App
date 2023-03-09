import { Slider } from "@miblanchard/react-native-slider";
import { AVPlaybackStatus, AVPlaybackStatusSuccess, Video } from "expo-av";
import { View } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { IEpisode } from "../../src/types";

interface IProps {
  episode: IEpisode;
  video: React.MutableRefObject<Video | null>;
  state?: AVPlaybackStatusSuccess;
}

const VideoControls: React.FC<IProps> = ({ episode, video, state }) => {
  const theme = useTheme();

  return (
    <View
      style={{
        position: "absolute",
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        padding: 8,
        backgroundColor: "rgba(0, 0, 0, 0.0)",
      }}
    >
      <View style={{ flexGrow: 1, flexDirection: "row", justifyContent: "center", alignItems: "flex-start" }}>
        <Text>hi</Text>
        <Text>hi</Text>
        <Text>hi</Text>
      </View>
      <View style={{ flexGrow: 1, flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
        <Text>middle</Text>
      </View>
      <View style={{ flexGrow: 1, flexDirection: "row", justifyContent: "center", alignItems: "flex-end" }}>
        <Slider
          minimumValue={0}
          value={state?.positionMillis}
          maximumValue={state?.durationMillis}
          containerStyle={{ width: "100%" }}
          animateTransitions
          minimumTrackTintColor={theme.colors.primary}
          maximumTrackTintColor={theme.colors.surfaceVariant}
          trackStyle={{ elevation: 0, height: 4, borderRadius: theme.roundness }}
          thumbStyle={{
            backgroundColor: theme.colors.primary,
            shadowColor: theme.colors.shadow,
            shadowOpacity: 1 / 12,
            elevation: 1,
            width: 20,
            height: 20,
            borderRadius: 360,
          }}
          thumbTouchSize={{ width: 20, height: 20 }}
          thumbTintColor={theme.colors.primary}
        />
      </View>
    </View>
  );
};

export default VideoControls;
