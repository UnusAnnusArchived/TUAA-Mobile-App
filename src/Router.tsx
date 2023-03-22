import { NavigationContainer } from "@react-navigation/native";
import { useEffect, useMemo, useState } from "react";
import { BottomNavigation } from "react-native-paper";
import { useRecoilState } from "recoil";
import { userAtom } from "./atoms";
import pb from "./pocketbase";
import { useURL, parse as parseURL } from "expo-linking";

// Page Imports
import Home, { pageInfo as homeInfo } from "../pages/home";
import Settings, { pageInfo as settingsInfo } from "../pages/settings";
import Profile, { pageInfo as profileInfo } from "../pages/profile";
import Login, { pageInfo as loginInfo } from "../pages/login";
import Debug, { pageInfo as debugInfo } from "../pages/debug";
import getPathSegment from "./tools/getPathSegment";

const Router: React.FC = () => {
  const [index, setIndex] = useState(0);
  const [loggedInUser, setLoggedInUser] = useRecoilState(userAtom);
  const url = useURL();

  useMemo(() => {
    if (url) {
      console.log(parseURL(url));
      const path = parseURL(url).hostname as keyof typeof map;
      const map = {
        home: 0,
        profile: 1,
        login: 1,
        settings: 2,
        debug: 3,
      };
      setIndex(map[path ?? "home"]);
    }
  }, [url]);

  const loggedInRoutes = [homeInfo, profileInfo, settingsInfo, debugInfo];
  const loggedOutRoutes = [homeInfo, loginInfo, settingsInfo, debugInfo];
  const routes = loggedInUser?.token ? loggedInRoutes : loggedOutRoutes;

  const loggedInMap = BottomNavigation.SceneMap({
    [homeInfo.key]: Home,
    [profileInfo.key]: Profile,
    [settingsInfo.key]: Settings,
    [debugInfo.key]: Debug,
  });
  const loggedOutMap = BottomNavigation.SceneMap({
    [homeInfo.key]: Home,
    [loginInfo.key]: Login,
    [settingsInfo.key]: Settings,
    [debugInfo.key]: Debug,
  });
  const map = loggedInUser?.token ? loggedInMap : loggedOutMap;

  return (
    <NavigationContainer>
      <BottomNavigation navigationState={{ index, routes }} onIndexChange={setIndex} renderScene={map} />
    </NavigationContainer>
  );
};

export default Router;
