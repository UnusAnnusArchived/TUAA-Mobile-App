import { Text, Button } from "react-native-paper";
import Layout from "../../components/layout";
import type { IPageInfo } from "../../src/types";
import { ScrollView } from "react-native";
import * as FileSystem from "expo-file-system";

const Downloads: React.FC = () => {
  const handleDownloadTest = async () => {
    console.log("aaaaa1");
    try {
      const download = FileSystem.createDownloadResumable(
        "https://download.unusann.us/01/001/2160.mp4",
        FileSystem.documentDirectory + "s01.e001.mp4",
        {},
        (downloadProgress) => {
          const progress = downloadProgress.totalBytesWritten / downloadProgress.totalBytesExpectedToWrite;
          console.log(progress);
        }
      );
      console.log("aaaaa2");
      try {
        console.log("aaaaa3");
        const a = await download.downloadAsync();
        console.log("aaaaa4" + a?.uri);
      } catch (err) {
        console.error(err);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Layout title={pageInfo.title}>
      <ScrollView>
        <Button onPress={handleDownloadTest}>Test download</Button>
      </ScrollView>
    </Layout>
  );
};

export default Downloads;

export const pageInfo: IPageInfo = {
  key: "downloads",
  title: "Downloads",
  focusedIcon: "download",
};
