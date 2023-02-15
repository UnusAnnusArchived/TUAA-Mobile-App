import { ThemeBase } from "react-native-paper";
import { InternalTheme } from "react-native-paper/lib/typescript/types";
import type { $DeepPartial } from "@callstack/react-theme-provider";
import { useEffect, useState } from "react";

const lightTheme: $DeepPartial<InternalTheme> = {
  dark: false,
};

const darkTheme: $DeepPartial<InternalTheme> = {
  dark: true,
};

const useInitialTheme = () => {
  const [theme, setTheme] = useState();

  useEffect(() => {}, []);
};

export default useInitialTheme;
