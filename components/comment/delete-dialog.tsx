import { Button, Dialog, Portal, Text, useTheme } from "react-native-paper";
import { IComment } from "../../src/types";

interface IProps {
  comment: IComment;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const DeleteDialog: React.FC<IProps> = ({ comment, open, setOpen }) => {
  const theme = useTheme();

  const handleClose = () => {
    setOpen(false);
  };

  const handleEdit = () => {};

  return (
    <Portal>
      <Dialog visible={open} onDismiss={handleClose}>
        <Dialog.Title>Are you sure you want to delete your comment?</Dialog.Title>
        <Dialog.Content>
          <Text>Are you sure you want to permanently delete your comment? This can not be undone!</Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button mode="text" onPress={handleClose}>
            Cancel
          </Button>
          <Button
            mode="contained"
            onPress={handleEdit}
            buttonColor={theme.colors.errorContainer}
            textColor={theme.colors.onErrorContainer}
          >
            Delete
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

export default DeleteDialog;
