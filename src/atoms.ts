import ReactNativeRecoilPersist from "react-native-recoil-persist";
import { atom } from "recoil";
import { IDownloadQueue, IUserAtom } from "./types";

export const userAtom = atom<IUserAtom>({
  key: "user",
  default: undefined,
  effects: [ReactNativeRecoilPersist.persistAtom],
});

export const downloadQueueAtom = atom<IDownloadQueue>({
  key: "download-queue",
  default: [],
  effects: [ReactNativeRecoilPersist.persistAtom],
});
