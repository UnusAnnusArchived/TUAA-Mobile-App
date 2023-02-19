import { NavigationContainer } from "@react-navigation/native";
import { BottomNavigation, Provider as PaperProvider } from "react-native-paper";
import theme from "../components/theme";
import { useFonts } from "expo-font";
import { RecoilRoot } from "recoil";
import Router from "./Router";
import { useEffect } from "react";
import RecoilNexus from "./tools/nexus";
import { ReactNativeRecoilPersist, ReactNativeRecoilPersistGate } from "react-native-recoil-persist";

export const recoilPersist = new ReactNativeRecoilPersist();

const Main: React.FC = () => {
  const [fontsLoaded] = useFonts({
    "FiraCode-Retina": require("../assets/fonts/FiraCode-Retina.ttf"),
  });

  return (
    <RecoilRoot>
      <ReactNativeRecoilPersistGate store={recoilPersist}>
        <RecoilNexus>
          <PaperProvider>
            <Router />
          </PaperProvider>
        </RecoilNexus>
      </ReactNativeRecoilPersistGate>
    </RecoilRoot>
  );
};

export default Main;
