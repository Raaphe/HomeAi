import { observer } from "mobx-react-lite"
import { ComponentType, FC, useEffect, useMemo, useRef, useState } from "react"
import { TextInput, TextStyle, ViewStyle } from "react-native"
import { Button, Icon, Screen, Text, TextField, TextFieldAccessoryProps } from "../components"
import { useStores } from "../models"
import { AppStackScreenProps } from "../navigators"
import type { ThemedStyle } from "@/theme"
import { useNavigation } from "@react-navigation/native"
import { useAppTheme } from "@/utils/useAppTheme"
import { AuthenticationApi, UsersApi } from "@/api/generated-client"
import { constructFrom } from "date-fns"

interface LoginScreenProps extends AppStackScreenProps<"Login"> {}

export const LoginScreen = observer(function LoginScreen(_props) {
  const authPasswordInput = useRef<TextInput>(null)
  const navigation = useNavigation<AppStackScreenProps<"Login">["navigation"]>() // Add proper navigation typing

  const [authPassword, setAuthPassword] = useState("")
  const [isAuthPasswordHidden, setIsAuthPasswordHidden] = useState(true)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [attemptsCount, setAttemptsCount] = useState(0)

  const {
    authenticationStore: { authEmail, setAuthEmail, setAuthToken, authToken, validationError },
  } = useStores()

  const {
    themed,
    theme: { colors },
  } = useAppTheme()

  useEffect(() => {
    function checkJwt() {
      if (authToken !== "")
        navigation.navigate("UserListings")
    }
    checkJwt();
  }, [])

  const error = isSubmitted ? validationError : ""

  async function login() {
    setIsSubmitted(true)
    setAttemptsCount(attemptsCount + 1)

    try {
      const response = await new AuthenticationApi().authPost({
        email: authEmail,
        password: authPassword,
      })

      if (response?.status !== 200 || !response.data) {
        console.error("Invalid credentials or server error")
        return
      }

      const userToken = response.data?.data || ""

      setIsSubmitted(false)
      setAuthPassword("")
      setAuthEmail("")

      setAuthToken(userToken)

      navigation.navigate("UserListings")
    } catch (error) {
      console.error("Login failed:", error)
    }
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
      <Text testID="login-heading" tx="loginScreen:logIn" preset="heading" style={themed($logIn)} />
      <Text preset="subheading" style={themed($enterDetails)}>
        Enter your details to get access to your profile and discover more about Home AI
      </Text>
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
        labelTx="loginScreen:emailFieldLabel"
        placeholderTx="loginScreen:emailFieldPlaceholder"
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
        labelTx="loginScreen:passwordFieldLabel"
        placeholderTx="loginScreen:passwordFieldPlaceholder"
        RightAccessory={PasswordRightAccessory}
      />

      <Button
        testID="login-button"
        tx="loginScreen:tapToLogIn"
        style={themed($tapButton)}
        preset="reversed"
        onPress={login}
      />

      <Button
        testID="signup-button"
        style={themed($tapButton)}
        onPress={() => navigation.navigate("SignUpScreen")}
      >
        Don't have an account? Sign up
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
