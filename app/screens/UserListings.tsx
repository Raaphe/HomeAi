import { observer } from "mobx-react-lite"
import { FC, useEffect, useState } from "react"
import { Button } from "../components";
import {
  View,
  ViewStyle,
  TextStyle,
  Text,
  ActivityIndicator
} from "react-native"
import { Screen, Card } from "@/components"
import { useAppTheme } from "@/utils/useAppTheme"
import { CreateListingDTO, UsersApi } from "@/api/generated-client"
import { $styles, ThemedStyle } from "../theme"
import { useNavigation, NavigationProp } from "@react-navigation/native"
import { AppStackParamList } from "../navigators" // Ensure your navigator types are correctly defined
import { useStores } from "../models"

const ICON_SIZE = 14

interface UserListingsProps {
  route: {
    params?: Record<string, any>
  }
}

export const UserListings: FC<UserListingsProps> = observer(({ route }) => {
  const navigation = useNavigation<NavigationProp<AppStackParamList, "Login">>()
  const {
    authenticationStore: { authToken, setAuthToken },
  } = useStores()
  const { themed } = useAppTheme()

  const [listings, setListings] = useState<CreateListingDTO[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    (async function load() {
      setIsLoading(true)
      try {
        const response = await new UsersApi().userTokenGet(authToken || "")
        if (response.data.code !== 200) {
          setAuthToken("")
          navigation.navigate("Login")
          return
        }

        setListings(response.data.data?.listings || [])
      } catch (error) {
        console.error("Error fetching listings:", error)
      } finally {
        setIsLoading(false)
      }
    })()
  }, [authToken, navigation, setAuthToken])

  return (
    <Screen style={themed($screenContainer)}>
      <Text style={themed($title)}>Your Listings</Text>
      {isLoading ? (
        <ActivityIndicator size="large" color="gray" />
      ) : listings.length > 0 ? (
        <>
          {listings.map((listingItem, index) => (
            <EpisodeCard key={index} listing={listingItem} />
          ))}
          <Button
              style={themed($button)}
              preset="reversed"
              onPress={() => navigation.navigate('UserListingUpload')}
            >
              Create a listing
          </Button>
        </>
      ) : (
        <>
          <Text style={themed($noListingsText)}>No listings available</Text>
          <Button
              style={themed($button)}
              preset="reversed"
              onPress={() => navigation.navigate('UserListingUpload')}
            >
              Create a listing
          </Button>
        </>
      )}
    </Screen>
  )
})

const EpisodeCard: FC<{ listing: CreateListingDTO }> = ({ listing }) => {
  const {
    theme: { colors },
    themed,
  } = useAppTheme()

  const handlePressCard = () => {
    console.log("Card pressed", listing)
  }

  return (
    <View style={themed($cardContainer)}>
      <Card
        style={themed($item)}
        verticalAlignment="force-footer-bottom"
        onPress={handlePressCard}
        HeadingComponent={
          <View style={[$styles.row, themed($metadata)]}>
            <Text style={themed($metadataText)}>{listing.property_id}</Text>
          </View>
        }
        content={`${listing.address}, ${listing.city}, ${listing.state}, ${listing.zip_code}`}
        FooterComponent={
          <View style={[$styles.row, themed($metadata)]}>
            <Text style={themed($metadataText)}>{listing.bedrooms} Beds</Text>
            <Text style={themed($metadataText)}>{listing.bathrooms} Baths</Text>
            <Text style={themed($metadataText)}>{listing.building_size} sq. foot</Text>
            <Text style={themed($metadataText)}>
              {listing.land_size?.toLocaleString()} Acres
            </Text>
          </View>
        }
      />
    </View>
  )
}

const $screenContainer: ThemedStyle<any> = ({ colors, spacing }) => ({
  padding: spacing.lg,
  marginTop: 30,
  backgroundColor: colors.background,
  flex: 1,
})

const $title: ThemedStyle<TextStyle> = ({ colors, spacing }) => ({
  fontSize: 24,
  fontWeight: "bold",
  marginBottom: spacing.md,
  color: colors.text,
})

const $item: ThemedStyle<any> = ({ colors, spacing }) => ({
  padding: spacing.md,
  marginTop: spacing.md,
  minHeight: 120,
  backgroundColor: colors.palette.neutral100,
  borderRadius: spacing.sm,
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
})

const $cardContainer: ThemedStyle<any> = ({ spacing }) => ({
  marginBottom: spacing.sm,
})

const $metadata: ThemedStyle<TextStyle> = ({ colors, spacing }) => ({
  color: colors.textDim,
  marginTop: spacing.xs,
})

const $metadataText: ThemedStyle<TextStyle> = ({ colors, spacing }) => ({
  color: colors.textDim,
  marginEnd: spacing.md,
  marginBottom: spacing.xs,
})

const $noListingsText: ThemedStyle<TextStyle> = ({ colors, spacing }) => ({
  fontSize: 16,
  color: colors.textDim,
  marginTop: spacing.lg,
})

const $button: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginTop: spacing.sm,
});
