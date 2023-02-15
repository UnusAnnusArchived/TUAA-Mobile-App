import { NavigationContainer } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { Appbar, BottomNavigation, Provider as PaperProvider, Text } from "react-native-paper";
import theme from "./components/theme";

import Home, { pageInfo as homeInfo } from "./pages/home";
import Profile, { pageInfo as profileInfo } from "./pages/profile";
import Settings, { pageInfo as settingsInfo } from "./pages/settings";
import Debug, { pageInfo as debugInfo } from "./pages/debug";

const Main: React.FC = () => {
  const [index, setIndex] = useState(0);

  const routes = [homeInfo, profileInfo, settingsInfo, debugInfo];

  const map = BottomNavigation.SceneMap({
    [homeInfo.key]: Home,
    [profileInfo.key]: Profile,
    [settingsInfo.key]: Settings,
    [debugInfo.key]: Debug,
  });

  useEffect(() => {
    (async () => {})();
  }, []);

  return (
    <PaperProvider>
      <NavigationContainer>
        <BottomNavigation navigationState={{ index, routes }} onIndexChange={setIndex} renderScene={map} />
      </NavigationContainer>
    </PaperProvider>
  );
};

export default Main;
