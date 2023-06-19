import { Slider } from "@miblanchard/react-native-slider";
import { AVPlaybackStatus, AVPlaybackStatusSuccess, Video } from "expo-av";
import { Animated, View } from "react-native";
import { ActivityIndicator, IconButton, Text, useTheme } from "react-native-paper";
import { IDownloadedEpisode, IEpisode } from "../../src/types";
import { useRef, useState } from "react";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import { SliderOnChangeCallback } from "@miblanchard/react-native-slider/lib/types";

interface IProps {
  episode: IEpisode | IDownloadedEpisode;
  video: React.MutableRefObject<Video | null>;
  state?: AVPlaybackStatusSuccess;
}

const VideoControls: React.FC<IProps> = ({ episode, video, state }) => {
  const theme = useTheme();
  const opacity = useRef(new Animated.Value(1)).current;
  const [showing, setShowing] = useState(true);

  const msToTimestamp = (duration: number) => {
    const ms = Math.floor((duration % 1000) / 100);
    const seconds = Math.floor((duration / 1000) % 60);
    const minutes = Math.floor((duration / (1000 * 60)) % 60);
    const hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

    const m = hours === 0 ? minutes : minutes < 10 ? "0" + minutes : minutes;
    const s = seconds < 10 ? "0" + seconds : seconds;

    return hours === 0 ? `${m}:${s}` : `${hours}:${m}${s}`;
  };

  let hideTimeout: NodeJS.Timeout;

  const show = () => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 100,
      useNativeDriver: true,
    }).start();
    setShowing(true);

    if (hideTimeout) {
      clearTimeout(hideTimeout);
    }
    hideTimeout = setTimeout(() => {
      if (state?.isPlaying) {
        hide();
      }
    }, 5000);
  };

  const hide = () => {
    Animated.timing(opacity, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
    setShowing(false);
  };

  const handlePress = () => {
    if (showing) {
      hide();
    } else if (!showing) {
      show();
    }
  };

  const togglePlay = async () => {
    if (state?.isPlaying) {
      await video.current?.pauseAsync();
    } else if (!state?.isPlaying) {
      await video.current?.playAsync();

      if (hideTimeout) {
        clearTimeout(hideTimeout);
      }

      hideTimeout = setTimeout(() => {
        if (state?.isPlaying) {
          hide();
        }
      }, 5000);
    }
  };

  const handleScrubberChange: SliderOnChangeCallback = (value) => {
    video.current?.setPositionAsync(value[0], { toleranceMillisBefore: 0, toleranceMillisAfter: 0 });
  };

  return (
    <>
      <TouchableWithoutFeedback
        containerStyle={{
          position: "absolute",
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          padding: 8,
          backgroundColor: "rgba(0, 0, 0, 0.0)",
          zIndex: 1,
        }}
        onPress={handlePress}
      />
      <Animated.View
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          padding: 8,
          backgroundColor: "rgba(0, 0, 0, 0.0)",
          opacity: opacity,
          zIndex: showing ? 2 : 0,
        }}
        pointerEvents="box-none"
      >
        <View
          pointerEvents="box-none"
          style={{ flexGrow: 1, flexDirection: "row", justifyContent: "center", alignItems: "flex-start" }}
        >
          <View
            pointerEvents="box-none"
            style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}
          >
            <Text>{episode.title}</Text>
            <View pointerEvents="none" style={{ flexGrow: 1 }} />
            {/* <IconButton icon="cog" mode="contained" size={16} /> */}
          </View>
        </View>
        <View
          pointerEvents="box-none"
          style={{ flexGrow: 1, flexDirection: "row", justifyContent: "center", alignItems: "center" }}
        >
          {state?.isBuffering ? (
            <ActivityIndicator size={32} />
          ) : (
            <IconButton
              icon={state?.isPlaying ? "pause" : "play"}
              mode="contained-tonal"
              style={{ backgroundColor: "rgba(0, 0, 0, 0.8)" }}
              size={32}
              onPress={togglePlay}
            />
          )}
        </View>
        <View
          pointerEvents="box-none"
          style={{ flexGrow: 1, flexDirection: "row", justifyContent: "center", alignItems: "flex-end" }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              gap: 8,
              marginHorizontal: 8,
            }}
          >
            <Text>{msToTimestamp(state?.positionMillis ?? 0)}</Text>
            <View style={{ flexGrow: 1 }}>
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
                onValueChange={handleScrubberChange}
              />
            </View>
            <Text>{msToTimestamp(state?.durationMillis ?? 0)}</Text>
          </View>
        </View>
      </Animated.View>
    </>
  );
};

export default VideoControls;
