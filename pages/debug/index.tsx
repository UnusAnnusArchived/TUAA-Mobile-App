import { ScrollView, View } from "react-native";
import { Button, Divider, Surface, Text } from "react-native-paper";
import Comment from "../../components/comment";
import Layout from "../../components/layout";
import useDeviceType from "../../src/tools/useDeviceType";
import type { IComment, IPageInfo } from "../../src/types";
import pb from "../../src/pocketbase";
import { useState } from "react";

const markdownTestComment: IComment = {
  collectionId: "c374lpcmdsvqwim",
  collectionName: "comments",
  created: "0",
  episode: "s01.e001",
  id: "0",
  isEdited: true,
  markdown: `Markdown test comment:

Table:
| This | Is | A | Table |
|---|---|---|---|
| a | a | a | a |

\`\`\`
code block
\`\`\`

> Block quote

hr:
***

1. This
2. is
3. a
4. List

* This
* is
* a
* list

# This is a heading 1
## This is a heading 2
### This is a heading 3

Linkify:
https://unusann.us

\\*\\*this text is in escaped bold\\*\\*

\`this text is in backticks\`

~~this text is stricken through~~

**this text is emphasized**

[this is a link](https://unusann.us)

Image:
![Unus Annus Logo](https://unusann.us/ua.png)

<span>inline html</span>

this&nbsp;is&nbsp;separated&nbsp;by&nbsp;html&nbsp;entities`,
  updated: "0",
  user: "n2xipyc8w6m9rbs",
};

const Profile: React.FC = () => {
  const deviceType = useDeviceType();
  const [refreshText, setRefreshText] = useState("Refresh User Authentication");

  const handleRefreshUser = () => {
    setRefreshText("Resetting...");
    pb.collection("users").authRefresh();
    setRefreshText("Finished Resetting");
    setTimeout(() => {
      setRefreshText("Refresh User Authentication");
    }, 2000);
  };

  return (
    <Layout title={pageInfo.title}>
      <ScrollView>
        <Text>Device Type: {deviceType}</Text>
        <Button style={{}} mode="contained" onPress={handleRefreshUser}>
          {refreshText}
        </Button>
        <Surface style={{ margin: 16, padding: 16 }}>
          <Comment
            comment={markdownTestComment}
            mutate={async () => {
              return undefined;
            }}
          />
          <Divider />
        </Surface>
      </ScrollView>
    </Layout>
  );
};

export default Profile;

export const pageInfo: IPageInfo = {
  key: "debug",
  title: "Debug",
  focusedIcon: "bug",
};
