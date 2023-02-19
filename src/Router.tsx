import { NavigationContainer } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { BottomNavigation } from "react-native-paper";
import { useRecoilState } from "recoil";
import { userAtom } from "./atoms";
import pb from "./pocketbase";

// Page Imports
import Home, { pageInfo as homeInfo } from "../pages/home";
import Profile, { pageInfo as profileInfo } from "../pages/profile";
import Settings, { pageInfo as settingsInfo } from "../pages/settings";
import Login, { pageInfo as loginInfo } from "../pages/login";
import Debug, { pageInfo as debugInfo } from "../pages/debug";

const Router: React.FC = () => {
  const [index, setIndex] = useState(0);
  const [loggedInUser, setLoggedInUser] = useRecoilState(userAtom);

  const loggedInRoutes = [homeInfo, profileInfo, settingsInfo, debugInfo];
  const loggedOutRoutes = [homeInfo, settingsInfo, loginInfo, debugInfo];
  const routes = loggedInUser?.token ? loggedInRoutes : loggedOutRoutes;

  const loggedInMap = BottomNavigation.SceneMap({
    [homeInfo.key]: Home,
    [profileInfo.key]: Profile,
    [settingsInfo.key]: Settings,
    [debugInfo.key]: Debug,
  });
  const loggedOutMap = BottomNavigation.SceneMap({
    [homeInfo.key]: Home,
    [settingsInfo.key]: Settings,
    [loginInfo.key]: Login,
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
