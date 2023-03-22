import { useMemo, useRef, useState } from "react";
import { ActivityIndicator, Button, Dialog, Portal, Text, TextInput, useTheme } from "react-native-paper";
import { TextInput as RNTextInput } from "react-native";
import { passwordReg } from "../../src/tools/regex";
import pb from "../../src/pocketbase";
import { useRecoilState } from "recoil";
import { userAtom } from "../../src/atoms";
import ErrorSnackbar from "./error-snackbar";
import SuccessSnackbar from "./success-snackbar";

interface IProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const DeleteAccountDialog: React.FC<IProps> = ({ open, setOpen }) => {
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordValid, setPasswordValid] = useState(true);
  const passwordRef = useRef<RNTextInput>(null);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmPasswordValid, setConfirmPasswordValid] = useState(true);
  const confirmPasswordRef = useRef<RNTextInput>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [formValid, setFormValid] = useState(false);
  const theme = useTheme();
  const [currentUser] = useRecoilState(userAtom);
  const [showSuccessSnackbar, setShowSuccessSnackbar] = useState(false);
  const [showErrorSnackbar, setShowErrorSnackbar] = useState(false);
  const [error, setError] = useState<any>();

  useMemo(() => {
    setFormValid(passwordValid && confirmPasswordValid);
  }, [passwordValid, confirmPasswordValid]);

  const handleDismiss = () => {
    setLoading(false);
    setPassword("");
    setPasswordValid(false);
    setConfirmPassword("");
    setConfirmPasswordValid(true);
    setShowPassword(true);
    setFormValid(false);
    setOpen(false);
    setError(undefined);
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    setPasswordValid(!!text.match(passwordReg));
    setConfirmPasswordValid(text === confirmPassword);
  };

  const handleConfirmPasswordChange = (text: string) => {
    setConfirmPassword(text);
    setConfirmPasswordValid(!!text.match(passwordReg) && text === text);
  };

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async () => {
    if (formValid && currentUser.model?.id && currentUser.model.email) {
      try {
        setLoading(true);
        await pb.collection("users").authWithPassword(currentUser.model.email, password);
        await pb.collection("users").delete(currentUser.model.id);
        setShowSuccessSnackbar(true);
        setLoading(false);
      } catch (err: any) {
        setPasswordValid(false);
        setConfirmPasswordValid(false);
        setFormValid(false);
        setLoading(false);
        setError(err);
        setShowErrorSnackbar(true);
        console.error(err);
      }
    }
  };

  return (
    <Portal>
      <Dialog visible={open} onDismiss={handleDismiss}>
        <Dialog.Title>Delete Account?</Dialog.Title>
        <Dialog.Content>
          <Text style={{ marginBottom: 26 }}>
            Are you sure you want to permanently delete your account? This will delete all your comments and cannot be
            undone! To continue please enter your password below.
          </Text>
          <TextInput
            autoComplete="password"
            autoCorrect={false}
            ref={passwordRef}
            disabled={loading}
            keyboardType="default"
            secureTextEntry={!showPassword}
            label="Password"
            value={password}
            onChangeText={handlePasswordChange}
            right={<TextInput.Icon icon={showPassword ? "eye-off" : "eye"} onPress={handleShowPassword} />}
            returnKeyType="next"
            error={!passwordValid}
            onSubmitEditing={() => {
              confirmPasswordRef.current?.focus();
            }}
          />
          <TextInput
            autoComplete="password"
            autoCorrect={false}
            ref={confirmPasswordRef}
            disabled={loading}
            keyboardType="default"
            secureTextEntry={!showPassword}
            label="Confirm Password"
            value={confirmPassword}
            onChangeText={handleConfirmPasswordChange}
            right={<TextInput.Icon icon={showPassword ? "eye-off" : "eye"} onPress={handleShowPassword} />}
            returnKeyType="go"
            error={!confirmPasswordValid}
            onSubmitEditing={handleSubmit}
          />
        </Dialog.Content>
        <Dialog.Actions>
          <Button disabled={loading} onPress={handleDismiss}>
            Cancel
          </Button>
          <Button
            mode="contained"
            buttonColor={theme.colors.errorContainer}
            textColor={theme.colors.onErrorContainer}
            disabled={!formValid || loading}
            onPress={handleSubmit}
          >
            {loading ? <ActivityIndicator color={theme.colors.onErrorContainer} /> : "Delete Account"}
          </Button>
        </Dialog.Actions>
      </Dialog>
      <ErrorSnackbar
        open={showErrorSnackbar}
        setOpen={setShowErrorSnackbar}
        error={error?.data?.message ?? "An unknown error has occurred!"}
      />
      <SuccessSnackbar open={showSuccessSnackbar} setOpen={setShowSuccessSnackbar} />
    </Portal>
  );
};

export default DeleteAccountDialog;
