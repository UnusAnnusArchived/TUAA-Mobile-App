import ReactNativeRecoilPersist from "react-native-recoil-persist";
import { atom } from "recoil";
import { IUserAtom } from "./types";

export const userAtom = atom<IUserAtom>({
  key: "user",
  default: undefined,
  effects_UNSTABLE: [ReactNativeRecoilPersist.persistAtom],
});
