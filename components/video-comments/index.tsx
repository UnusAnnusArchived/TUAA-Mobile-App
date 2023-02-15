import { useEffect, useState } from "react";
import { Surface, Text, useTheme } from "react-native-paper";
import { IComment, IEpisode, ISortType } from "../../types";
import pb from "../../pocketbase";
import Comment from "../comment";
import useSWR from "swr";
import moment from "moment-with-locales-es6";
import DropDown from "react-native-paper-dropdown";
import { View } from "react-native";

interface IProps {
  episode: IEpisode;
}

const VideoComments: React.FC<IProps> = ({ episode }) => {
  const [sortType, setSortType] = useState<ISortType>("latest");

  const fetcher = async (sortType: ISortType) => {
    const comments = await pb.collection("comments").getFullList<IComment>(undefined, {
      filter: `episode="s${episode.season.toString().padStart(2, "0")}.e${episode.episode
        .toString()
        .padStart(3, "0")}"`,
    });

    comments.sort((aDate, bDate) => {
      const a = moment.utc(aDate.created!).unix();
      const b = moment.utc(bDate.created!).unix();

      if (a > b) {
        return -1;
      } else if (a < b) {
        return 1;
      } else {
        return 0;
      }
    });

    if (sortType === "oldest") {
      comments.reverse();
    }

    return comments;
  };

  const { data, mutate, error } = useSWR<IComment[]>(sortType, fetcher);

  const [showSortBy, setShowSortBy] = useState(false);

  return (
    <Surface style={{ marginTop: 16, padding: 16 }}>
      <View style={{ marginBottom: 16, flexDirection: "row", alignItems: "center" }}>
        <Text variant="titleLarge" style={{ marginRight: 16 }}>
          Comments
        </Text>
        <DropDown
          label="Sort By"
          mode="outlined"
          visible={showSortBy}
          showDropDown={() => {
            setShowSortBy(true);
          }}
          onDismiss={() => {
            setShowSortBy(false);
          }}
          value={sortType}
          setValue={setSortType}
          list={[
            { label: "Newest", value: "latest" },
            { label: "Oldest", value: "oldest" },
          ]}
        />
      </View>
      {data && data.length > 0 ? (
        data.map((comment, index) => {
          return <Comment comment={comment} mutate={mutate} key={comment.id} />;
        })
      ) : (
        <Text variant="bodyLarge" style={{ textAlign: "center" }}>
          No comments found. How about you get the conversation started?
        </Text>
      )}
    </Surface>
  );
};

export default VideoComments;
