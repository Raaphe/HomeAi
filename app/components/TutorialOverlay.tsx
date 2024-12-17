import React, { useState, useEffect } from "react"
import { View, Text, TouchableOpacity, Modal, Animated, ViewStyle, TextStyle, Image } from "react-native"
import { useAppTheme } from "@/utils/useAppTheme"
import { type ThemedStyle } from "@/theme"

export const TutorialOverlay = () => {
  const [showOverlay, setShowOverlay] = useState(true)
  const { themed, theme } = useAppTheme()
  const img = require('../../assets/images/Swipe.png')

  const closeOverlay = () => setShowOverlay(false)

  const arrowTranslateX = new Animated.Value(0)

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(arrowTranslateX, {
          toValue: 50,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(arrowTranslateX, {
          toValue: -50,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    ).start()
  }, [])

  return (
    <Modal visible={showOverlay} transparent animationType="fade">
      <View style={themed($overlay)}>
        <Text style={themed($instructionText)}>Swipe the charts to see more values</Text>

        <Animated.View
          style={[themed($arrowContainer), { transform: [{ translateX: arrowTranslateX }] }]}
        >
          <Image source ={img} style={themed($finger)} tintColor={theme.isDark ? theme.colors.palette.neutral900 : undefined}/>
        </Animated.View>

        <TouchableOpacity onPress={closeOverlay} style={themed($dismissButton)}>
          <Text style={themed($dismissText)}>I got it</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  )
}

const $overlay: ThemedStyle<ViewStyle> = () => ({
  flex: 1,
  backgroundColor: "rgba(0, 0, 0, 0.6)",
  justifyContent: "center",
  alignItems: "center",
})

const $instructionText: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: "white",
  fontSize: 18,
  textAlign: "center",
  marginBottom: 20,
})
const $finger = () => ({
  width : 100,
  height : 100
})
const $arrowContainer: ThemedStyle<ViewStyle> = () => ({
  marginVertical: 10,
})

const $arrowText: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.background,
  fontSize: 50,
})

const $dismissButton: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  backgroundColor: colors.background,
  paddingVertical: spacing.sm,
  paddingHorizontal: spacing.lg,
  borderRadius: 10,
  marginTop: 20,
})

const $dismissText: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.text,
  fontWeight: "bold",
})
