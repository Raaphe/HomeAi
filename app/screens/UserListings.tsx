import { observer } from "mobx-react-lite"
import { FC, useEffect, useState } from "react"
import {ScrollView} from "react-native"
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
import { CreateListingDTO, EditListingDto, ListingsApi, UsersApi } from "@/api/generated-client"
import { $styles, ThemedStyle } from "../theme"
import { useNavigation, NavigationProp, useFocusEffect } from "@react-navigation/native"
import { AppStackParamList } from "../navigators" // Ensure your navigator types are correctly defined
import { useStores } from "../models"
import {
  Configuration,
  ConfigurationParameters,
} from "@/api/generated-client";

const ICON_SIZE = 14

interface UserListingsProps {
  route: {
    params?: Record<string, any>
  }
}

export const UserListings: FC<UserListingsProps> = observer(({ route }) => {
  const navigation = useNavigation<NavigationProp<AppStackParamList, "Login">>()
  const {
    authenticationStore: { authToken, setAuthToken, logout },
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
        <ScrollView>
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
          <Button
              style={themed($buttonBack)}
              onPress={() => {
                logout();
                navigation.goBack();
              }}
            >
              Log out
          </Button>
        </ScrollView>
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
          <Button
              style={themed($button)}
              onPress={() => {
                logout();
                navigation.goBack();
              }}
            >
              Log out
          </Button>
        </>
      )}
    </Screen>
  )
})

const EpisodeCard: FC<{ listing: EditListingDto }> = ({ listing }) => {
  const {
    theme: { colors },
    themed,
  } = useAppTheme()

  const {
    authenticationStore: { authToken},
  } = useStores()

  const configParam: ConfigurationParameters = {
    accessToken: authToken,
  };

  const handlePressCard = () => {
    console.log("Card pressed", listing)
  }

  const deleteListing = async (id: string) => {
    try {
      if(id !== ""){
        const response = await new ListingsApi(new Configuration(configParam)).listingIdDelete(id)
        if (response.status === 204) {
          console.log("Listing deleted successfully!");
        }
      }
    } catch (error) {
      console.error("Listing creation error:", error);
    }
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
      <Button
              style={themed($button)}
              preset="reversed"
              onPress={() => deleteListing(listing.property_id??"")}
            >
              Delete
      </Button>
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

const $buttonBack: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginTop: spacing.sm,
  marginBottom: spacing.sm,
});
