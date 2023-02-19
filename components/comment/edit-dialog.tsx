import { useMemo, useState } from "react";
import { Button, Dialog, Portal, Text, TextInput } from "react-native-paper";
import { IComment } from "../../src/types";

interface IProps {
  comment: IComment;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const EditDialog: React.FC<IProps> = ({ comment, open, setOpen }) => {
  const [markdown, setMarkdown] = useState(comment.markdown);

  useMemo(() => {
    setMarkdown(comment.markdown);
  }, [open]);

  const handleClose = () => {
    setMarkdown("");
    setOpen(false);
  };

  const handleTextChange = (text: string) => {
    setMarkdown(text);
  };

  const handleEdit = () => {};

  return (
    <Portal>
      <Dialog visible={open} onDismiss={handleClose}>
        <Dialog.Title>Edit Comment</Dialog.Title>
        <Dialog.Content>
          <TextInput
            style={{ maxHeight: 200 }}
            label="Comment"
            value={markdown}
            onChangeText={handleTextChange}
            multiline
          />
        </Dialog.Content>
        <Dialog.Actions>
          <Button mode="text" onPress={handleClose}>
            Cancel
          </Button>
          <Button mode="contained" onPress={handleEdit}>
            Edit
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

export default EditDialog;
