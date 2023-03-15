import { Provider as PaperProvider } from "react-native-paper";
import theme from "../components/theme";
import { useFonts } from "expo-font";
import { RecoilRoot } from "recoil";
import Router from "./Router";
import RecoilNexus from "./tools/nexus";
import ReactNativeRecoilPersist, { ReactNativeRecoilPersistGate } from "react-native-recoil-persist";

const Main: React.FC = () => {
  const [fontsLoaded] = useFonts({
    "FiraCode-Retina": require("../assets/fonts/FiraCode-Retina.ttf"),
  });

  return (
    <PaperProvider>
      <RecoilRoot>
        <ReactNativeRecoilPersistGate store={ReactNativeRecoilPersist}>
          <RecoilNexus>
            <Router />
          </RecoilNexus>
        </ReactNativeRecoilPersistGate>
      </RecoilRoot>
    </PaperProvider>
  );
};

export default Main;
