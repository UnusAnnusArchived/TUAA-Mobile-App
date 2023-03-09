import { useEffect, useMemo, useState } from "react";
import { GestureResponderEvent, useWindowDimensions, View } from "react-native";
import { Divider, IconButton, Text, useTheme } from "react-native-paper";
import { IComment, IUser } from "../../src/types";
import pb from "../../src/pocketbase";
import getPbImagePath from "../../src/tools/getPbImagePath";
import moment from "moment-with-locales-es6";
import MarkdownIt from "markdown-it";
import mdIterator from "markdown-it-for-inline";
import Markdown from "react-native-markdown-display";
import { KeyedMutator } from "swr";
import CommentOptions from "./options";
import { useRecoilState } from "recoil";
import { userAtom } from "../../src/atoms";
import Avatar from "../avatar";

const md = MarkdownIt({ html: false, xhtmlOut: false, breaks: true, langPrefix: "", linkify: true })
  .disable(["image", "link", "table", "code", "fence", "hr", "html_block", "heading", "entity"])
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
  const dimensions = useWindowDimensions();
  const [showTools, setShowTools] = useState(false);
  const [optionsOpen, setOptionsOpen] = useState(false);
  const [loggedInUser, setLoggedInUser] = useRecoilState(userAtom);

  useEffect(() => {
    (async () => {
      setUser(await pb.collection("users").getOne(comment.user));
    })();
  }, []);

  useMemo(() => {
    if (loggedInUser?.model?.isAdmin === true || loggedInUser?.model?.id === comment.user) {
      setShowTools(true);
    } else {
      setShowTools(false);
    }
  }, [comment, user]);

  const handleControlsPopup = (evt: GestureResponderEvent) => {
    setOptionsOpen(true);
  };

  return (
    <>
      <Divider />
      <View style={{ flexDirection: "row", marginVertical: 8 }}>
        <Avatar user={user} />
        <View style={{ width: dimensions.width - 137 - (showTools ? 40 : 0), overflow: "hidden" }}>
          <View style={{ flexDirection: "row", alignItems: "center", flexShrink: 1, flexWrap: "wrap" }}>
            <Text variant="titleMedium" style={{ fontWeight: "bold" }}>
              {user?.name}{" "}
            </Text>
            <Text style={{ color: theme.colors.onBackground }}>{moment(comment.created).fromNow()} </Text>
            {comment.isEdited && <Text>(Edited)</Text>}
          </View>
          {/* @ts-ignore types are writted poorly */}
          <Markdown
            style={{
              body: {
                color: theme.colors.onBackground,
                width: "100%",
              },
              bullet_list_icon: { color: theme.colors.onBackground },
              ordered_list_icon: { color: theme.colors.onBackground },
              code_inline: {
                fontFamily: "FiraCode-Retina",
                backgroundColor: theme.colors.elevation.level3,
                color: theme.colors.onBackground,
              },
              blockquote: {
                backgroundColor: theme.colors.elevation.level3,
                borderColor: theme.colors.primary,
              },
            }}
            markdownit={md}
          >
            {comment.markdown}
          </Markdown>
        </View>
        {showTools && (
          <View style={{ width: 40, justifyContent: "center" }}>
            <CommentOptions
              anchor={<IconButton onPress={handleControlsPopup} icon="dots-vertical" />}
              comment={comment}
              open={optionsOpen}
              setOpen={setOptionsOpen}
            />
          </View>
        )}
      </View>
    </>
  );
};

export default Comment;
