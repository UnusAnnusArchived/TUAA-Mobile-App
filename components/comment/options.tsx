import { useState } from "react";
import { Menu } from "react-native-paper";
import { IComment } from "../../src/types";
import DeleteDialog from "./delete-dialog";
import EditDialog from "./edit-dialog";

interface IProps {
  comment: IComment;
  anchor: JSX.Element;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const CommentOptions: React.FC<IProps> = ({ comment, anchor, open, setOpen }) => {
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpenEditDialog = () => {
    setOpen(false);
    setShowEditDialog(true);
  };

  const handleOpenDeleteDialog = () => {
    setOpen(false);
    setShowDeleteDialog(true);
  };

  return (
    <>
      <Menu visible={open} onDismiss={handleClose} anchor={anchor}>
        <Menu.Item leadingIcon="pencil" title="Edit" onPress={handleOpenEditDialog} />
        <Menu.Item leadingIcon="delete" title="Delete" onPress={handleOpenDeleteDialog} />
      </Menu>
      <EditDialog comment={comment} open={showEditDialog} setOpen={setShowEditDialog} />
      <DeleteDialog comment={comment} open={showDeleteDialog} setOpen={setShowDeleteDialog} />
    </>
  );
};

export default CommentOptions;
