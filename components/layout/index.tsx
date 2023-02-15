import { Animated, StyleProp, View, ViewStyle } from "react-native";
import { Appbar, Surface, Text, useTheme } from "react-native-paper";
import { IPageAction } from "../../types";

interface IProps extends React.PropsWithChildren {
  backButton?: boolean;
  backButtonAction?: () => any;
  title: string;
  actions?: IPageAction[];
  headerStyles?: Animated.WithAnimatedValue<StyleProp<ViewStyle>>;
}

const Layout: React.FC<IProps> = ({ backButton, backButtonAction, title, actions, headerStyles, children }) => {
  const theme = useTheme();

  return (
    <>
      <Appbar.Header elevated style={headerStyles}>
        {backButton && <Appbar.BackAction onPress={backButtonAction} />}
        <Appbar.Content title={title} />
      </Appbar.Header>
      <View style={{ flex: 1, backgroundColor: theme.colors.background }}>{children}</View>
    </>
  );
};

export default Layout;
