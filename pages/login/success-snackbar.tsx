import { Portal, Snackbar } from "react-native-paper";

interface IProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const SuccessSnackbar: React.FC<IProps> = ({ open, setOpen }) => {
  const handleDismiss = () => {
    setOpen(false);
  };

  return (
    <Portal>
      <Snackbar visible={open} onDismiss={handleDismiss}>
        Successfully logged in!
      </Snackbar>
    </Portal>
  );
};

export default SuccessSnackbar;
