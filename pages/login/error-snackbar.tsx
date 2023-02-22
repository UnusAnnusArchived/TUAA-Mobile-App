import { Portal, Snackbar, useTheme } from "react-native-paper";

interface IProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  error: string;
}

const ErrorSnackbar: React.FC<IProps> = ({ open, setOpen, error }) => {
  const theme = useTheme();

  const handleDismiss = () => {
    setOpen(false);
  };

  return (
    <Portal>
      <Snackbar
        theme={{
          colors: { inverseSurface: theme.colors.error, inverseOnSurface: theme.colors.onError },
        }}
        visible={open}
        onDismiss={handleDismiss}
      >
        {error}
      </Snackbar>
    </Portal>
  );
};

export default ErrorSnackbar;
