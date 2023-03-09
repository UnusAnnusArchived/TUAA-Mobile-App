import { useEffect, useState } from "react";
import { FlatList, ScrollView, View, RefreshControl } from "react-native";
import { ActivityIndicator, Button, Text } from "react-native-paper";
import type { IEpisode } from "../../src/types";
import Episode from "../episode";
import device, { DeviceType } from "expo-device";
import useDeviceType from "../../src/tools/useDeviceType";
import { StackNavigationProp } from "@react-navigation/stack";
import { ParamList } from "../../pages/home";
import { api } from "../../src/endpoints";

interface IProps {
  season: 0 | 1;
  navigation: StackNavigationProp<ParamList, "Videos">;
}

const SeasonView: React.FC<IProps> = ({ season, navigation }) => {
  const [episodes, setEpisodes] = useState<IEpisode[]>([]);
  const [fetchError, setFetchError] = useState<Error>();
  const [loading, setLoading] = useState(false);
  const deviceType = useDeviceType();

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      setEpisodes([]);
      setFetchError(undefined);
      const res: IEpisode[] = await fetch(`${api}/v2/metadata/season/s${season.toString().padStart(2, "0")}`).then(
        (res) => res.json()
      );
      setEpisodes(res);
      setLoading(false);
    } catch (err: any) {
      setFetchError(err);
    }
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
          refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchVideos} />}
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
