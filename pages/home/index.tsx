import { NavigationContainer, NavigationContainerRef } from "@react-navigation/native";
import { createStackNavigator, StackScreenProps } from "@react-navigation/stack";
import { useURL, parse as parseURL } from "expo-linking";
import { useRef, useState, useEffect, useMemo, useCallback } from "react";
import { Animated, useWindowDimensions, View } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { SceneMap, TabBar, TabView } from "react-native-tab-view";
import Layout from "../../components/layout";
import SeasonView from "../../components/season-view";
import { api } from "../../src/endpoints";
import getPathSegment from "../../src/tools/getPathSegment";
import type { IDownloadedEpisode, IEpisode, IPageInfo } from "../../src/types";
import Watch from "../watch";

export type ParamList = {
  Videos: undefined;
  Watch: { episode?: IEpisode | IDownloadedEpisode };
};

const Stack = createStackNavigator<ParamList>();

const HomeNavigator: React.FC = () => {
  const ref = useRef<NavigationContainerRef<ParamList>>(null);
  const url = useURL();

  useMemo(() => {
    if (url) {
      if (ref.current) {
        const episodeID = getPathSegment<string>(parseURL(url).path, 0);
        (async () => {
          const episode: IEpisode = await fetch(`${api}/v2/metadata/episode/${episodeID}`).then((res) => res.json());
          ref.current!.navigate("Watch", { episode });
        })();
      }
    }
  }, [url, ref]);

  return (
    <NavigationContainer ref={ref} independent>
      <Stack.Navigator initialRouteName="Videos" screenOptions={{ headerShown: false, cardStyle: {} }}>
        <Stack.Screen name="Videos" component={Videos} />
        <Stack.Screen name="Watch" component={Watch} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default HomeNavigator;

const routes = [
  { key: "s01", title: "Season 1" },
  { key: "s00", title: "Specials" },
];

const Videos: React.FC<StackScreenProps<ParamList, "Videos">> = ({ navigation }) => {
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const theme = useTheme();
  const url = useURL();

  useMemo(() => {
    if (url) {
      const seasonNumber = getPathSegment<string>(parseURL(url).path, 0);
      if (seasonNumber) {
        if (seasonNumber.includes("00")) {
          setIndex(1);
        } else if (seasonNumber.includes("01")) {
          setIndex(0);
        }
      }
    }
  }, [url]);

  const map = useCallback(
    SceneMap({
      s01: () => <SeasonView season={1} navigation={navigation} />,
      s00: () => <SeasonView season={0} navigation={navigation} />,
    }),
    []
  );

  return (
    <Layout title={pageInfo.title} headerStyles={{ elevation: 0 }}>
      <TabView
        navigationState={{ index, routes }}
        renderScene={map}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
        renderTabBar={(props) => (
          <TabBar
            {...props}
            renderLabel={({ route, color }) => (
              <Text style={{ color: theme.colors.onBackground, margin: 8 }}>{route.title}</Text>
            )}
            indicatorStyle={{ backgroundColor: theme.colors.onBackground }}
            style={{ backgroundColor: theme.colors.elevation.level2, elevation: 2 }}
          />
        )}
      />
    </Layout>
  );
};

export const pageInfo: IPageInfo = {
  key: "home",
  title: "Home",
  focusedIcon: "home",
};
