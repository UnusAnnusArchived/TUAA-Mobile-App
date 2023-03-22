import { Button, Dialog, Portal, TextInput } from "react-native-paper";
import { useRecoilState } from "recoil";
import { userAtom } from "../../src/atoms";
import * as Clipboard from "expo-clipboard";

interface IProps {
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
}

const JSONData: React.FC<IProps> = ({ show, setShow }) => {
  const [currentUser] = useRecoilState(userAtom);

  const handleDismiss = () => {
    setShow(false);
  };

  const handleCopy = async () => {
    await Clipboard.setStringAsync(JSON.stringify(currentUser.model, null, 2));
    handleDismiss();
  };

  return (
    <Portal>
      <Dialog visible={show} onDismiss={handleDismiss}>
        <Dialog.Title>Raw Profile Data</Dialog.Title>
        <Dialog.Content>
          <TextInput
            label="Raw Profile Data"
            editable={false}
            value={JSON.stringify(currentUser.model, null, 2)}
            multiline
          />
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={handleCopy}>Copy</Button>
          <Button onPress={handleDismiss} mode="contained">
            Close
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

export default JSONData;
