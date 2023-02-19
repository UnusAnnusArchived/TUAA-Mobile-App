import moment from "moment";
import { useWindowDimensions } from "react-native";
import { Divider, Surface, Text, useTheme } from "react-native-paper";
import RenderHTML from "react-native-render-html";
import type { IEpisode } from "../../src/types";

interface IProps {
  episode: IEpisode;
}

const VideoInfo: React.FC<IProps> = ({ episode }) => {
  const theme = useTheme();
  const dimensions = useWindowDimensions();

  return (
    <Surface style={{ marginTop: 16, padding: 8 }}>
      <Text variant="titleLarge">{episode.title}</Text>
      <Text variant="bodyLarge">{moment(episode.date ?? episode.releasedate).format("DD MMMM YYYY")}</Text>
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
