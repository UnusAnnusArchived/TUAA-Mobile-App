import { useEffect, useState } from "react";
import { View } from "react-native";
import { Avatar, Divider, Text, useTheme } from "react-native-paper";
import { IComment, IUser } from "../../types";
import pb from "../../pocketbase";
import getPbImagePath from "../../tools/getPbImagePath";
import moment from "moment-with-locales-es6";
import MarkdownIt from "markdown-it";
import mdIterator from "markdown-it-for-inline";
import Markdown from "react-native-markdown-display";
import { KeyedMutator } from "swr";

const md = MarkdownIt({ html: false, xhtmlOut: false, breaks: true, langPrefix: "", linkify: true })
  .disable(["image", "link"])
  .use(mdIterator, "url_new_win", "link_open", (tokens: any, idx: any) => {
    const [, href] = tokens[idx].attrs.find((attr: any) => attr[0] === "href");

    if (href) {
      tokens[idx].attrPush(["target", "_blank"]);
      tokens[idx].attrPush(["rel", "noopener noreferrer"]);
    }
  });

interface IProps {
  comment: IComment;
  mutate: KeyedMutator<IComment[]>;
}

const Comment: React.FC<IProps> = ({ comment }) => {
  const [user, setUser] = useState<IUser>();
  const theme = useTheme();

  useEffect(() => {
    (async () => {
      setUser(await pb.collection("users").getOne(comment.user));
    })();
  }, []);

  return (
    <>
      <Divider />
      <View style={{ flexDirection: "row", marginVertical: 8 }}>
        <View style={{ alignItems: "flex-start", marginHorizontal: 12 }}>
          {user && user.avatar ? (
            <Avatar.Image source={{ uri: getPbImagePath(user.collectionId!, user.id!, user.avatar!) }} />
          ) : (
            <Avatar.Text label={user?.name?.substring?.(0, 1) ?? "..."} />
          )}
        </View>
        <View>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text variant="titleMedium" style={{ fontWeight: "bold" }}>
              {user?.name}
            </Text>
            <Text style={{ color: theme.colors.onBackground }}>&nbsp;{moment(comment.created).fromNow()}</Text>
          </View>
          {/* @ts-ignore types are bad and don't allow children when docs say to use children */}
          <Markdown markdownit={md}>{comment.markdown}</Markdown>
        </View>
      </View>
    </>
  );
};

export default Comment;
