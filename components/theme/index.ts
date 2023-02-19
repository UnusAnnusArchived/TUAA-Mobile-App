import { ThemeBase } from "react-native-paper";
import { InternalTheme } from "react-native-paper/lib/typescript/types";
import type { $DeepPartial } from "@callstack/react-theme-provider";

const theme: $DeepPartial<InternalTheme> = {
  mode: "adaptive",
  colors: {
    background: "#121212",
    accent: "#272727",
    text: "#ffffff",
    primary: "#ffffff",
  },
};

export default theme;
