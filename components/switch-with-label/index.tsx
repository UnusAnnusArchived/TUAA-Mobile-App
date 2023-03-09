import { StyleProp, View, ViewStyle } from "react-native";
import { Switch, SwitchProps, Text } from "react-native-paper";

interface IProps extends Omit<SwitchProps, "style"> {
  label: string | JSX.Element;
  gap?: number;
  labelPosition?: "left" | "right";
  style?: StyleProp<ViewStyle>;
  switchStyle?: StyleProp<ViewStyle>;
}

const SwitchWithLabel: React.FC<IProps> = (props) => {
  const labelPosition = props.labelPosition ?? "right";
  const gap = props.gap ?? 12;

  if (labelPosition === "left") {
    return (
      <View
        style={{ flexDirection: "row", alignItems: "center", ...(typeof props.style === "object" ? props.style : []) }}
      >
        <View style={{ marginRight: gap }}>
          {typeof props.label === "string" ? <Text>{props.label}</Text> : props.label}
        </View>
        <Switch {...props} style={props.switchStyle} />
      </View>
    );
  } else {
    return (
      <View
        style={{ flexDirection: "row", alignItems: "center", ...(typeof props.style === "object" ? props.style : []) }}
      >
        <Switch {...props} style={props.switchStyle} />
        <View style={{ marginLeft: gap }}>
          {typeof props.label === "string" ? <Text>{props.label}</Text> : props.label}
        </View>
      </View>
    );
  }
};

export default SwitchWithLabel;
