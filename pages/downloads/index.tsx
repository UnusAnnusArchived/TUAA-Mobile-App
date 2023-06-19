import { Text, Button, Surface } from "react-native-paper";
import Layout from "../../components/layout";
import { IDownloadQueue, IDownloadedEpisode, type IEpisode, type IPageInfo } from "../../src/types";
import { ScrollView } from "react-native";
import * as fs from "expo-file-system";
import { NavigationContainer, NavigationContainerRef } from "@react-navigation/native";
import { useEffect, useRef, useState } from "react";
import { StackScreenProps, createStackNavigator } from "@react-navigation/stack";
import Watch from "../watch";
import { ParamList } from "../home";
import Episode from "../../components/episode";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRecoilState } from "recoil";
import { downloadQueueAtom } from "../../src/atoms";

// const handleDownloadTest = async () => {
//   console.log("aaaaa1");
//   try {
//     const download = fs.createDownloadResumable(
//       "https://download.unusann.us/01/001/2160.mp4",
//       fs.documentDirectory + "s01.e001.mp4",
//       {},
//       (downloadProgress) => {
//         const progress = downloadProgress.totalBytesWritten / downloadProgress.totalBytesExpectedToWrite;
//         console.log(progress);
//       }
//     );
//     console.log("aaaaa2");
//     try {
//       console.log("aaaaa3");
//       const a = await download.downloadAsync();
//       console.log("aaaaa4" + a?.uri);
//     } catch (err) {
//       console.error(err);
//     }
//   } catch (err) {
//     console.error(err);
//   }
// };

const Stack = createStackNavigator<ParamList>();

const DownloadsContainer: React.FC = () => {
  const ref = useRef<NavigationContainerRef<ParamList>>(null);

  return (
    <NavigationContainer ref={ref} independent>
      <Stack.Navigator initialRouteName="Videos" screenOptions={{ headerShown: false, cardStyle: {} }}>
        <Stack.Screen name="Videos" component={Downloads} />
        <Stack.Screen name="Watch" component={Watch} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default DownloadsContainer;

const Downloads: React.FC<StackScreenProps<ParamList, "Videos">> = ({ navigation }) => {
  const [downloadQueue, setDownloadQueue] = useRecoilState(downloadQueueAtom);
  const [downloadedEpisodes, setDownloadedEpisodes] = useState<IDownloadedEpisode[]>([]);

  useEffect(() => {
    (async () => {
      //Fetch metadata
      const dir = fs.documentDirectory + "Metadata/";

      if (!(await fs.getInfoAsync(dir)).exists) {
        await fs.makeDirectoryAsync(dir);
      }

      const metadataDir = await fs.readDirectoryAsync(dir);

      let episodes: IDownloadedEpisode[] = [];
      for (let i = 0; i < metadataDir.length; i++) {
        if (metadataDir[i].endsWith(".json")) {
          const episode: IDownloadedEpisode = JSON.parse(await fs.readAsStringAsync(dir + metadataDir[i]));
          episodes.push(episode);
        }
      }

      setDownloadedEpisodes(episodes);
    })();
  }, []);

  return (
    <Layout title={pageInfo.title}>
      <ScrollView>
        <Surface>
          {downloadQueue.map((item, index) => {
            return (
              <Text>
                {downloadedEpisodes.find((episode) => episode.downloadUuids.includes(item.downloadUuid))?.title ??
                  "Error"}
              </Text>
            );
          })}
        </Surface>
        {downloadedEpisodes.map((episode, index) => {
          return <Episode key={index} episode={episode} navigation={navigation} />;
        })}
      </ScrollView>
    </Layout>
  );
};

export const pageInfo: IPageInfo = {
  key: "downloads",
  title: "Downloads",
  focusedIcon: "download",
};
