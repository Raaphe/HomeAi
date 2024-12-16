import { observer } from "mobx-react-lite"
import { ComponentType, FC, useEffect, useMemo, useRef, useState } from "react"
import { TextInput, TextStyle, ViewStyle } from "react-native"
import { Button, Icon, Screen, Text, TextField, TextFieldAccessoryProps } from "../components"
import { useStores } from "../models"
import { AppStackScreenProps } from "../navigators"
import type { ThemedStyle } from "@/theme"
import { useAppTheme } from "@/utils/useAppTheme"
import { useNavigation } from '@react-navigation/native';
import { integer, number } from "mobx-state-tree/dist/internal"

export const SignUpScreen: FC<any> = observer(function SignUpScreen(_props) {
  const authPasswordInput = useRef<TextInput>(null)
  const navigation = useNavigation();
  const [authPassword, setAuthPassword] = useState("")
  const [isAuthPasswordHidden, setIsAuthPasswordHidden] = useState(true)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [attemptsCount, setAttemptsCount] = useState(0)
  const {
    authenticationStore: { authEmail, setAuthEmail, setAuthToken, validationError },
  } = useStores()
  const {
    themed,
    theme: { colors },
  } = useAppTheme()

  const [firstName, setFirstName] = useState("")
  const firstNameInput = useRef<TextInput>(null)
  const [lastName, setLastName] = useState("")
  const lastNameInput = useRef<TextInput>(null)
  const [phoneNumber, setPhoneNumber] = useState("")
  const phoneNumberInput = useRef<TextInput>(null)
  const [companyName, setCompanyName] = useState("")
  const companyNameInput = useRef<TextInput>(null)
  const [profilePic, setProfilePic] = useState("")
  const profilePicInput = useRef<TextInput>(null)

  useEffect(() => {
    // Here is where you could fetch credentials from keychain or storage
    // and pre-fill the form fields.
    setAuthEmail("ignite@infinite.red")
    setAuthPassword("ign1teIsAwes0m3")

    // Return a "cleanup" function that React will run when the component unmounts
    return () => {
      setAuthPassword("")
      setAuthEmail("")
    }
  }, [setAuthEmail])

  const error = isSubmitted ? validationError : ""

  function signUp() {
    setIsSubmitted(true)
    setAttemptsCount(attemptsCount + 1)

    if (validationError) return

    // Make a request to your server to get an authentication token.
    // If successful, reset the fields and set the token.
    setIsSubmitted(false)
    setAuthPassword("")
    setAuthEmail("")

    // We'll mock this with a fake token.
    setAuthToken(String(Date.now()))
  }

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
        )
      },
    [isAuthPasswordHidden, colors.palette.neutral800],
  )

  return (
    <Screen
      preset="auto"
      contentContainerStyle={themed($screenContentContainer)}
      safeAreaEdges={["top", "bottom"]}
    >
      <Text testID="login-heading" preset="heading" style={themed($logIn)}>Sign Up</Text>
      <Text preset="subheading" style={themed($enterDetails)}>Please enter your information to get started</Text>
      {attemptsCount > 2 && (
        <Text tx="loginScreen:hint" size="sm" weight="light" style={themed($hint)} />
      )}

      <TextField
        value={authEmail}
        onChangeText={setAuthEmail}
        containerStyle={themed($textField)}
        autoCapitalize="none"
        autoComplete="email"
        autoCorrect={false}
        keyboardType="email-address"
        label="Email"
        helper={error}
        status={error ? "error" : undefined}
        onSubmitEditing={() => firstNameInput.current?.focus()}
      />

      <TextField
        ref={firstNameInput}
        value={firstName}
        onChangeText={setFirstName}
        containerStyle={themed($textField)}
        autoCapitalize="none"
        autoCorrect={false}
        label="First Name"
        placeholder="Your first name"
        helper={error}
        status={error ? "error" : undefined}
        onSubmitEditing={() => lastNameInput.current?.focus()}
      />

      <TextField
        ref={lastNameInput}
        value={lastName}
        onChangeText={setLastName}
        containerStyle={themed($textField)}
        autoCapitalize="none"
        autoCorrect={false}
        label="Last Name"
        placeholder="Your last name"
        helper={error}
        status={error ? "error" : undefined}
        onSubmitEditing={() => authPasswordInput.current?.focus()}
      />

      <TextField
        ref={authPasswordInput}
        value={authPassword}
        onChangeText={setAuthPassword}
        containerStyle={themed($textField)}
        autoCapitalize="none"
        autoComplete="password"
        autoCorrect={false}
        secureTextEntry={isAuthPasswordHidden}
        label="Password"
        onSubmitEditing={() => phoneNumberInput.current?.focus()}
        RightAccessory={PasswordRightAccessory}
      />

      <TextField
        ref={phoneNumberInput}
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        containerStyle={themed($textField)}
        autoCapitalize="none"
        autoCorrect={false}
        maxLength={10}
        keyboardType="number-pad"
        label="Phone Number"
        placeholder="0123456789"
        helper={error}
        status={error ? "error" : undefined}
        onSubmitEditing={() => companyNameInput.current?.focus()}
      />

      <TextField
        ref={companyNameInput}
        value={companyName}
        onChangeText={setCompanyName}
        containerStyle={themed($textField)}
        autoCapitalize="none"
        autoCorrect={false}
        label="Company Name"
        placeholder="Your company"
        helper={error}
        status={error ? "error" : undefined}
        onSubmitEditing={() => profilePicInput.current?.focus()}
      />

      <TextField
        ref={profilePicInput}
        value={profilePic}
        onChangeText={setProfilePic}
        containerStyle={themed($textField)}
        autoCapitalize="none"
        autoCorrect={false}
        label="Profile Picture"
        placeholder="Your profile picture's URL"
        helper={error}
        status={error ? "error" : undefined}
        onSubmitEditing={signUp}
      />

      <Button
        testID="login-button"
        style={themed($tapButton)}
        preset="reversed"
        onPress={signUp}
      >
        Sign Up
      </Button>

      <Button
        testID="go-back"
        style={themed($tapButton)}
        onPress={() => {
          navigation.goBack()
        }}
      >
          Go back
      </Button>
    </Screen>
  )
})

const $screenContentContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingVertical: spacing.xxl,
  paddingHorizontal: spacing.lg,
})

const $logIn: ThemedStyle<TextStyle> = ({ spacing }) => ({
  marginBottom: spacing.sm,
})

const $enterDetails: ThemedStyle<TextStyle> = ({ spacing }) => ({
  marginBottom: spacing.lg,
})

const $hint: ThemedStyle<TextStyle> = ({ colors, spacing }) => ({
  color: colors.tint,
  marginBottom: spacing.md,
})

const $textField: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginBottom: spacing.lg,
})

const $tapButton: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginTop: spacing.xs,
})
