import { DownloadPauseState } from "expo-file-system";
import { Record } from "pocketbase";
import { IconSource } from "react-native-paper/lib/typescript/src/components/Icon";

export interface IPageInfo {
  key: string;
  title: string;
  focusedIcon?: IconSource;
  unfocusedIcon?: IconSource;
  badge?: string | number | boolean;
  color?: string;
  accessibilityLabel?: string;
  testID?: string;
  lazy?: boolean;
}

export interface IPageAction {
  icon: string;
  onPress: () => any;
}

export interface IEpisode {
  season: number;
  episode: number;
  title: string;
  description: string;
  date?: number;
  releasedate?: number;
  duration: number;
  sources?: ISource[];
  video?: string;
  tracks: ITrack[];
  posters?: IPoster[];
  thumbnail?: string;
}

export interface ISource {
  src: string;
  type: string;
  size: number;
}

export interface ITrack {
  kind: string;
  label: string;
  srclang: string;
  src: string;
}

export interface IPoster {
  src: string;
  type: string;
  size?: number;
}

export interface IComment extends Partial<Record> {
  episode: string;
  markdown: string;
  user: string;
  isEdited: boolean;
}

export interface IUser extends Partial<Record> {
  username: string;
  email?: string;
  emailVisibility?: string;
  verified?: boolean;
  name: string;
  avatar: string;
  emails_account: boolean;
  emails_updates: boolean;
  isAdmin: boolean;
}

export type ISortType = "latest" | "oldest";

export interface IUserAtom {
  token: string | null;
  model: IUser | null;
}

export interface IDownloadedEpisode {
  __downloadedMetadataVersion: 1;
  downloadUuids: string[];
  isDownloaded: true;
  season: number;
  episode: number;
  title: string;
  description: string;
  date: number;
  duration?: number;
  downloadedSource: string;
  downloadedPoster: string;
  downloadedTracks: ITrack[];
}

export type IDownloadQueue = IDownloadQueueItem[];

export interface IDownloadQueueItem {
  downloadUuid: string;
  status: DownloadPauseState;
}
