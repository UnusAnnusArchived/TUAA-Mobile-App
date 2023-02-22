import { Portal, Snackbar } from "react-native-paper";

interface IProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const CreatedSnackbar: React.FC<IProps> = ({ open, setOpen }) => {
  const handleDismiss = () => {
    setOpen(false);
  };

  return (
    <Portal>
      <Snackbar visible={open} onDismiss={handleDismiss}>
        Account successfully created!
      </Snackbar>
    </Portal>
  );
};

export default CreatedSnackbar;
