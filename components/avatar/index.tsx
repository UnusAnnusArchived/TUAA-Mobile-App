import { Avatar as PaperAvatar } from "react-native-paper";
import { View } from "react-native";
import getPbImagePath from "../../src/tools/getPbImagePath";
import { IUser } from "../../src/types";

interface IProps {
  user?: IUser | null;
  margin?: number;
  size?: number;
}

const Avatar: React.FC<IProps> = ({ user, margin, size }) => {
  return (
    <View style={{ alignItems: "flex-start", marginHorizontal: margin ?? 12 }} accessibilityIgnoresInvertColors>
      {user && user.avatar ? (
        <PaperAvatar.Image
          size={size ?? 48}
          source={{ uri: getPbImagePath(user.collectionId!, user.id!, user.avatar!) }}
        />
      ) : user && user.name ? (
        <PaperAvatar.Text size={size ?? 48} label={user.name.substring?.(0, 1)} />
      ) : (
        <PaperAvatar.Icon size={size ?? 48} icon="account" />
      )}
    </View>
  );
};

export default Avatar;
