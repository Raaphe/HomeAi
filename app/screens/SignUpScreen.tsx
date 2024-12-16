import { observer } from "mobx-react-lite";
import { ComponentType, FC, useEffect, useMemo, useRef, useState } from "react";
import { TextInput, TextStyle, ViewStyle } from "react-native";
import { Button, Icon, Screen, Text, TextField, TextFieldAccessoryProps } from "../components";
import { useStores } from "../models";
import type { ThemedStyle } from "@/theme";
import { useAppTheme } from "@/utils/useAppTheme";
import { useNavigation } from "@react-navigation/native";
import { AuthenticationApi } from "../api/generated-client/api";

export const SignUpScreen: FC = observer(function SignUpScreen() {
  // References to text inputs
  const firstNameInput = useRef<TextInput>(null);
  const lastNameInput = useRef<TextInput>(null);
  const emailInput = useRef<TextInput>(null);
  const passwordInput = useRef<TextInput>(null);
  const phoneNumberInput = useRef<TextInput>(null);
  const companyNameInput = useRef<TextInput>(null);
  const profilePicInput = useRef<TextInput>(null);

  // State management
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [profilePic, setProfilePic] = useState("");
  const [isAuthPasswordHidden, setIsAuthPasswordHidden] = useState(true);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    theme: { colors },
    themed,
  } = useAppTheme();

  const navigation = useNavigation();
  const {
    authenticationStore: { setAuthToken },
  } = useStores();

  // Validation error logic (placeholder for real validation)
  const validationError = isSubmitted && !authEmail ? "Email is required" : "";

  // Password toggle icon logic
  const PasswordRightAccessory: ComponentType<TextFieldAccessoryProps> = useMemo(
    () =>
      function PasswordRightAccessory(props: TextFieldAccessoryProps) {
        return (
          <Icon
            icon={isAuthPasswordHidden ? "view" : "hidden"}
            color={colors.palette.neutral800}
            containerStyle={props.style}
            size={20}
            onPress={() => setIsAuthPasswordHidden(!isAuthPasswordHidden)}
          />
        );
      },
    [isAuthPasswordHidden, colors.palette.neutral800]
  );

  // Sign-up function
  async function signUp() {
    setIsSubmitted(true);

    if (!authEmail || !authPassword || !firstName || !lastName) {
      return; // Basic validation
    }

    try {
      const response = await new AuthenticationApi().registerPost({
        first_name: firstName,
        last_name: lastName,
        company_name: companyName,
        email: authEmail,
        password: authPassword,
        phone: phoneNumber,
        pfp: profilePic,
      });

      if (response.status === 200) {
        setAuthToken(response.data.data);
        resetForm();
      }
    } catch (error) {
      console.error("Sign-up error:", error);
    }
  }

  function resetForm() {
    setFirstName("");
    setLastName("");
    setAuthEmail("");
    setAuthPassword("");
    setPhoneNumber("");
    setCompanyName("");
    setProfilePic("");
    setIsSubmitted(false);
  }

  return (
    <Screen
      preset="auto"
      contentContainerStyle={themed($screenContentContainer)}
      safeAreaEdges={["top", "bottom"]}
    >
      <Text preset="heading" style={themed($heading)}>
        Sign Up
      </Text>
      <Text preset="subheading" style={themed($subheading)}>
        Please enter your information to create an account.
      </Text>

      <TextField
        ref={emailInput}
        value={authEmail}
        onChangeText={setAuthEmail}
        containerStyle={themed($textField)}
        autoCapitalize="none"
        autoComplete="email"
        keyboardType="email-address"
        label="Email"
        placeholder="Your email"
        helper={validationError}
        status={validationError ? "error" : undefined}
        onSubmitEditing={() => firstNameInput.current?.focus()}
      />

      <TextField
        ref={firstNameInput}
        value={firstName}
        onChangeText={setFirstName}
        containerStyle={themed($textField)}
        label="First Name"
        placeholder="Your first name"
        onSubmitEditing={() => lastNameInput.current?.focus()}
      />

      <TextField
        ref={lastNameInput}
        value={lastName}
        onChangeText={setLastName}
        containerStyle={themed($textField)}
        label="Last Name"
        placeholder="Your last name"
        onSubmitEditing={() => passwordInput.current?.focus()}
      />

      <TextField
        ref={passwordInput}
        value={authPassword}
        onChangeText={setAuthPassword}
        containerStyle={themed($textField)}
        secureTextEntry={isAuthPasswordHidden}
        label="Password"
        RightAccessory={PasswordRightAccessory}
        onSubmitEditing={() => phoneNumberInput.current?.focus()}
      />

      <TextField
        ref={phoneNumberInput}
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        containerStyle={themed($textField)}
        keyboardType="number-pad"
        label="Phone Number"
        placeholder="0123456789"
        onSubmitEditing={() => companyNameInput.current?.focus()}
      />

      <TextField
        ref={companyNameInput}
        value={companyName}
        onChangeText={setCompanyName}
        containerStyle={themed($textField)}
        label="Company Name"
        placeholder="Your company (optional)"
        onSubmitEditing={() => profilePicInput.current?.focus()}
      />

      <TextField
        ref={profilePicInput}
        value={profilePic}
        onChangeText={setProfilePic}
        containerStyle={themed($textField)}
        label="Profile Picture"
        placeholder="Your profile picture's URL (optional)"
        onSubmitEditing={signUp}
      />

      <Button
        style={themed($button)}
        preset="reversed"
        onPress={signUp}
      >
        Sign Up
      </Button>

      <Button
        style={themed($button)}
        onPress={() => navigation.goBack()}
      >
        Go Back
      </Button>
    </Screen>
  );
});

// Styles
const $screenContentContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingVertical: spacing.xxl,
  paddingHorizontal: spacing.lg,
});

const $heading: ThemedStyle<TextStyle> = ({ spacing }) => ({
  marginBottom: spacing.sm,
});

const $subheading: ThemedStyle<TextStyle> = ({ spacing }) => ({
  marginBottom: spacing.lg,
});

const $textField: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginBottom: spacing.lg,
});

const $button: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginTop: spacing.sm,
});
