import { useEffect, useState } from "react";
import { FlatList, ScrollView, View } from "react-native";
import { ActivityIndicator, Button, Text } from "react-native-paper";
import type { IEpisode } from "../../src/types";
import Episode from "../episode";
import device, { DeviceType } from "expo-device";
import useDeviceType from "../../src/tools/useDeviceType";

interface IProps {
  season: 0 | 1;
  navigation: any;
}

const SeasonView: React.FC<IProps> = ({ season, navigation }) => {
  const [episodes, setEpisodes] = useState<IEpisode[]>([]);
  const [fetchError, setFetchError] = useState<Error | undefined>(undefined);
  const deviceType = useDeviceType();

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = () => {
    setEpisodes([]);
    setFetchError(undefined);
    fetch("https://unusann.us/api/v2/metadata/all")
      .then((res) => res.json())
      .then((res) => setEpisodes(res[season]))
      .catch(setFetchError);
  };

  return (
    <View>
      {episodes.length > 0 ? (
        <ScrollView
          contentContainerStyle={{
            justifyContent: "flex-start",
            alignItems: "stretch",
            padding: 8,
            flexWrap: deviceType !== DeviceType.PHONE ? "wrap" : undefined,
            flexDirection: deviceType !== DeviceType.PHONE ? "row" : undefined,
          }}
        >
          {episodes.map((episode, index) => {
            return <Episode key={index} episode={episode} navigation={navigation} />;
          })}
        </ScrollView>
      ) : (
        <View style={{ justifyContent: "center", alignItems: "center", height: "100%" }}>
          {fetchError ? (
            <>
              <Text>Failed to load videos!</Text>
              <Button style={{ marginTop: 8 }} mode="contained" onPress={fetchVideos}>
                Retry
              </Button>
            </>
          ) : (
            <ActivityIndicator />
          )}
        </View>
      )}
    </View>
  );
};

export default SeasonView;
