import { useState } from "react";
import { Button, Dialog, Portal, TextInput } from "react-native-paper";
import { emailReg } from "../../src/tools/regex";
import pb from "../../src/pocketbase";

interface IProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const ResetEmailDialog: React.FC<IProps> = ({ open, setOpen }) => {
  const [email, setEmail] = useState("");
  const [emailValid, setEmailValid] = useState(false);

  const handleDismiss = () => {
    setEmail("");
    setOpen(false);
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);

    if (value.match(emailReg)) {
      setEmailValid(true);
    } else {
      setEmailValid(false);
    }
  };

  const handleSubmit = async () => {
    if (emailValid) {
      pb.collection("users").requestEmailChange(email);
      handleDismiss();
    }
  };

  return (
    <Portal>
      <Dialog visible={open} onDismiss={handleDismiss}>
        <Dialog.Title>Update Email</Dialog.Title>
        <Dialog.Content>
          <TextInput
            keyboardType="email-address"
            autoComplete="email"
            autoCorrect={false}
            autoCapitalize="none"
            label="New Email"
            returnKeyType="send"
            onSubmitEditing={handleSubmit}
            value={email}
            onChangeText={handleEmailChange}
          />
        </Dialog.Content>
        <Dialog.Actions>
          <Button>Cancel</Button>
          <Button disabled={!emailValid} mode="contained" onPress={handleSubmit}>
            Send Confirmation
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

export default ResetEmailDialog;
