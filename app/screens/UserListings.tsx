import { observer } from "mobx-react-lite"
import { FC, useEffect, useMemo, useState } from "react"
import {
  View,
  TextStyle,
  Text,
  ActivityIndicator
} from "react-native"
import { Screen, Card } from "@/components"
import { useAppTheme } from "@/utils/useAppTheme"
import { CreateListingDTO, ListingsApi } from "@/api/generated-client"
import { $styles, ThemedStyle } from "../theme"

const ICON_SIZE = 14

export const UserListings: FC<any> = observer(function DemoPodcastListScreen() {
  const { themed } = useAppTheme()
  const [listing, setListings] = useState<CreateListingDTO[]>([])

  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    ;(async function load() {
      setIsLoading(true)
      const response = await new ListingsApi().listingsGet()
      const tempListings = response.data.data || []
      setListings(tempListings)
      setIsLoading(false)
    })()
  }, [])

  return (
    <Screen style={themed($screenContainer)}>
      <Text style={themed($title)}>Your Listings</Text>
      {isLoading ? (
        <ActivityIndicator size="large" color="gray" />
      ) : listing.length > 0 ? (
        listing.map((listingItem, index) => (
          <EpisodeCard key={index} listing={listingItem} />
        ))
      ) : (
        <Text style={themed($noListingsText)}>No listings available</Text>
      )}
    </Screen>
  )
})

const EpisodeCard: FC<{ listing: CreateListingDTO }> = ({ listing }) => {
  const { theme: { colors }, themed } = useAppTheme()

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
            <Text style={themed($metadataText)}>{listing.land_size?.toLocaleString()} Acres</Text>
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