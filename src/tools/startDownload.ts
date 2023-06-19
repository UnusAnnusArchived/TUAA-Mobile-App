import { IDownloadQueue, IDownloadedEpisode, IEpisode } from "../types";
import { SetterOrUpdater, useRecoilState } from "recoil";
import { downloadQueueAtom } from "../atoms";
import * as fs from "expo-file-system";
import { downloadUrl } from "../endpoints";
import uuid from "react-native-uuid";
import getEpisodeID from "./getEpisodeID";

const startDownload = async (episode: IEpisode, queue: IDownloadQueue, setQueue: SetterOrUpdater<IDownloadQueue>) => {
  let uuids: string[] = [];

  let newQueue = [...queue];

  const episodeDir = `${fs.documentDirectory}Season%20${episode.season}/Episode%20${episode.episode}/`;
  await checkAndMakeDir(episodeDir);

  const source = fs.createDownloadResumable(
    `${downloadUrl}${episode.sources?.[0]?.src ?? episode.video}`,
    `${episodeDir}/Video.mp4`
  );

  source.downloadAsync();

  newQueue.push({
    downloadUuid: uuids[uuids.push(uuid.v4() as string)],
    status: source.savable(),
  });

  const tracks =
    episode.tracks?.map?.((track) => {
      const trackDl = fs.createDownloadResumable(
        `${downloadUrl}${track.src}`,
        `${episodeDir}/${track.label}.${track.srclang}.vtt`
      );

      trackDl.downloadAsync();

      newQueue.push({
        downloadUuid: uuids[uuids.push(uuid.v4() as string)],
        status: trackDl.savable(),
      });

      return trackDl;
    }) ?? [];

  const poster = fs.createDownloadResumable(
    `${downloadUrl}/${
      episode.posters?.find?.((poster) => poster.type === "image/jpeg")?.src ??
      episode.thumbnail!.replace(".webp", ".jpg")
    }`,
    `${episodeDir}/Poster.jpg`
  );

  poster.downloadAsync();

  newQueue.push({
    downloadUuid: uuids[uuids.push(uuid.v4() as string)],
    status: poster.savable(),
  });

  setQueue(newQueue);

  const metadata: IDownloadedEpisode = {
    __downloadedMetadataVersion: 1,
    downloadUuids: uuids,
    isDownloaded: true,
    season: episode.season,
    episode: episode.episode,
    title: episode.title,
    description: episode.description,
    date: (episode.date ?? episode.releasedate)!,
    duration: episode.duration,
    downloadedSource: source.fileUri,
    downloadedPoster: poster.fileUri,
    downloadedTracks: tracks.map((track, i) => {
      const episodeTrack = episode.tracks[i];

      return {
        src: track.fileUri,
        kind: episodeTrack.kind,
        label: episodeTrack.label,
        srclang: episodeTrack.srclang,
      };
    }),
  };

  console.log(metadata);

  checkAndMakeDir(`${fs.documentDirectory}Metadata`);

  fs.writeAsStringAsync(
    `${fs.documentDirectory}Metadata/${getEpisodeID(episode.season, episode.episode)}.json`,
    JSON.stringify(metadata)
  );
};

const checkAndMakeDir = async (dir: string) => {
  if (!(await fs.getInfoAsync(dir)).exists) {
    await fs.makeDirectoryAsync(dir, { intermediates: true });
  }
};

export default startDownload;
