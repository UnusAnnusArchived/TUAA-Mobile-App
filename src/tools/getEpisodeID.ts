const getEpisodeID = (season: number, episode: number) => {
  return `s${season.toString().padStart(2, "0")}.e${episode.toString().padStart(3, "0")}`;
};

export default getEpisodeID;
