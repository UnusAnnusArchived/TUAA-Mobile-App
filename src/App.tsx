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
    <RecoilRoot>
      <ReactNativeRecoilPersistGate store={ReactNativeRecoilPersist}>
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
