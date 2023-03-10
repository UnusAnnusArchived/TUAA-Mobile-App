import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator, StackScreenProps } from "@react-navigation/stack";
import { useRef, useState, useEffect, useMemo, useCallback } from "react";
import { Animated, useWindowDimensions, View } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { SceneMap, TabBar, TabView } from "react-native-tab-view";
import Layout from "../../components/layout";
import SeasonView from "../../components/season-view";
import type { IEpisode, IPageInfo } from "../../src/types";
import Watch from "../watch";

export type ParamList = {
  Videos: undefined;
  Watch: { episode?: IEpisode };
};

const Stack = createStackNavigator<ParamList>();

const HomeNavigator: React.FC = () => {
  return (
    <NavigationContainer independent>
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
