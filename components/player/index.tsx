import { View } from "react-native";
import { IEpisode, ISource } from "../../src/types";
import { AVPlaybackStatus, AVPlaybackStatusError, AVPlaybackStatusSuccess, Video } from "expo-av";
import { useRef, useState } from "react";
import { cdn } from "../../src/endpoints";
import VideoControls from "./controls";

interface IProps {
  episode: IEpisode;
}

const Player: React.FC<IProps> = ({ episode }) => {
  const video = useRef<Video | null>(null);
  const [state, setState] = useState<AVPlaybackStatusSuccess>();
  const [error, setError] = useState<AVPlaybackStatusError>();

  const handlePlaybackStatusUpdate = (status: AVPlaybackStatus) => {
    if (status.isLoaded) {
      setState(status);
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
      />
      <VideoControls episode={episode} video={video} state={state} />
    </View>
  );
};

export default Player;
