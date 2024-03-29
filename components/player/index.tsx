import { View } from "react-native";
import { IDownloadedEpisode, IEpisode, ISource } from "../../src/types";
import { AVPlaybackStatus, AVPlaybackStatusError, AVPlaybackStatusSuccess, Video } from "expo-av";
import { useRef, useState } from "react";
import { cdn } from "../../src/endpoints";
import VideoControls from "./controls";
import { Button, Text } from "react-native-paper";

interface IProps {
  episode: IEpisode | IDownloadedEpisode;
}

const Player: React.FC<IProps> = ({ episode }) => {
  const video = useRef<Video | null>(null);
  const [state, setState] = useState<AVPlaybackStatusSuccess>();
  const [error, setError] = useState<AVPlaybackStatusError>();

  const handlePlaybackStatusUpdate = (status: AVPlaybackStatus) => {
    if (status.isLoaded) {
      setState(status);
      setError(undefined);
    } else {
      setError(status);
    }
  };

  return (
    <View
      style={{ aspectRatio: 16 / 9, backgroundColor: "#000000", position: "relative" }}
      accessibilityIgnoresInvertColors
    >
      <Video
        ref={video}
        onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
        style={{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0 }}
        videoStyle={{ width: "100%", height: "100%" }}
        source={{
          uri: `${cdn}${
            "sources" in episode
              ? episode.sources?.[0]?.src
              : "video" in episode
              ? episode.video
              : "downloadedSource" in episode
              ? episode.downloadedSource
              : undefined
          }`,
        }}
      />
      {error ? (
        <View style={{ justifyContent: "center", alignItems: "center", height: "100%" }}>
          <Text variant="titleMedium">There has been an eror loading your video!</Text>
          <Text>{error.error}</Text>
          <Button
            mode="contained"
            onPress={() => {
              setError(undefined);
            }}
          >
            Retry
          </Button>
        </View>
      ) : (
        <VideoControls episode={episode} video={video} state={state} />
      )}
    </View>
  );
};

export default Player;
