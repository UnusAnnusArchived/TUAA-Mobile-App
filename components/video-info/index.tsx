import moment from "moment";
import { useWindowDimensions } from "react-native";
import { Button, Divider, Surface, Text, useTheme } from "react-native-paper";
import RenderHTML from "react-native-render-html";
import type { IEpisode } from "../../src/types";
import startDownload from "../../src/tools/startDownload";
import { useRecoilState } from "recoil";
import { downloadQueueAtom } from "../../src/atoms";

interface IProps {
  episode: IEpisode;
}

const VideoInfo: React.FC<IProps> = ({ episode }) => {
  const [queue, setQueue] = useRecoilState(downloadQueueAtom);
  const theme = useTheme();
  const dimensions = useWindowDimensions();

  return (
    <Surface style={{ marginTop: 16, padding: 8 }}>
      <Text variant="titleLarge">{episode.title}</Text>
      <Text variant="bodyLarge">{moment(episode.date ?? episode.releasedate).format("DD MMMM YYYY")}</Text>
      <Button
        onPress={() => {
          startDownload(episode, queue, setQueue);
        }}
      >
        Download
      </Button>
      <Divider style={{ marginVertical: 8 }} />
      <RenderHTML
        contentWidth={dimensions.width}
        baseStyle={{ color: theme.colors.onBackground }}
        source={{ html: episode.description }}
      />
    </Surface>
  );
};

export default VideoInfo;
