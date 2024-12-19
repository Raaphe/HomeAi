import { observer } from "mobx-react-lite"
import { ComponentType, FC, useEffect, useMemo, useRef, useState } from "react"
import { TextInput, TextStyle, ViewStyle } from "react-native"
import { Button, Icon, Screen, Text, TextField, TextFieldAccessoryProps } from "../components"
import { useStores } from "../models"
import { useAppTheme } from "@/utils/useAppTheme"
import { useNavigation } from "@react-navigation/native"
import type { ThemedStyle } from "@/theme"
import { ListingsApi } from "../api/generated-client/api"
import {
  Configuration,
  ConfigurationParameters,
} from "@/api/generated-client"

export const UserListingUpload: FC = observer(function UserListingUpload() {
  // References to text inputs
  const addressInput = useRef<TextInput>(null)
  const bathroomsInput = useRef<TextInput>(null)
  const bedroomsInput = useRef<TextInput>(null)
  const buildingSizeInput = useRef<TextInput>(null)
  const cityInput = useRef<TextInput>(null)
  const descriptionInput = useRef<TextInput>(null)
  const emailInput = useRef<TextInput>(null)
  const imagesInput = useRef<TextInput>(null)
  const landSizeInput = useRef<TextInput>(null)
  const pricesInput = useRef<TextInput>(null)
  const propertyTypeInput = useRef<TextInput>(null)
  const stateInput = useRef<TextInput>(null)
  const zipCodeInput = useRef<TextInput>(null)
  const urlInput = useRef<TextInput>(null)

  // State management for inputs
  const [address, setAddress] = useState("")
  const [bathrooms, setBathrooms] = useState(0)
  const [bedrooms, setBedrooms] = useState(0)
  const [buildingSize, setBuildingSize] = useState(0)
  const [city, setCity] = useState("")
  const [description, setDescription] = useState("")
  const [email, setEmail] = useState("")
  const [images, setImages] = useState("")
  const [landSize, setLandSize] = useState(0)
  const [prices, setPrices] = useState({
    USD: 0,
    CAD: 0,
    EUR: 0,
  })
  const [propertyType, setPropertyType] = useState("")
  const [state, setState] = useState("")
  const [zipCode, setZipCode] = useState("")
  const [url, setUrl] = useState("")

  const {
    theme: { colors },
    themed,
  } = useAppTheme()

  const navigation = useNavigation()
  const {
    authenticationStore: { authToken, authEmail },
  } = useStores()

  const configParam: ConfigurationParameters = {
    accessToken: authToken,
  };

  useEffect(() => {
      if(authToken === ""){
        navigation.navigate('Login')
      }
  }, [])

  // Listing submission function
  async function createListing() {
    try {
      console.log(authEmail)
      const response = await new ListingsApi(new Configuration(configParam)).listingPost({
        address,
        bathrooms,
        bedrooms,
        building_size: buildingSize,
        city,
        description,
        email: authEmail,
        images: images.split(","),
        land_size: landSize,
        prices,
        property_type: propertyType,
        state,
        zip_code: zipCode,
        url,
      })
      
      if (response.status === 201) {
        // Handle success
        console.log("Listing created successfully!")
        resetForm()
        navigation.goBack()
      }
    } catch (error) {
      console.error("Listing creation error:", error)
    }
  }

  function resetForm() {
    setAddress("")
    setBathrooms(0)
    setBedrooms(0)
    setBuildingSize(0)
    setCity("")
    setDescription("")
    setEmail("")
    setImages("")
    setLandSize(0)
    setPrices({
      USD: 0,
      CAD: 0,
      EUR: 0,
    })
    setPropertyType("")
    setState("")
    setZipCode("")
    setUrl("")
  }

  return (
    <Screen
      preset="auto"
      contentContainerStyle={themed($screenContentContainer)}
      safeAreaEdges={["top", "bottom"]}
    >
      <Text preset="heading" style={themed($heading)}>
        Create a Property Listing
      </Text>
      <Text preset="subheading" style={themed($subheading)}>
        Enter the property details below.
      </Text>

      <TextField
        ref={addressInput}
        value={address}
        onChangeText={setAddress}
        containerStyle={themed($textField)}
        label="Address"
        placeholder="Property address"
        onSubmitEditing={() => bathroomsInput.current?.focus()}
      />

      <TextField
        ref={bathroomsInput}
        value={bathrooms.toString()}
        onChangeText={(text) => setBathrooms(Number(text))}
        containerStyle={themed($textField)}
        label="Bathrooms"
        placeholder="Number of bathrooms"
        keyboardType="number-pad"
        onSubmitEditing={() => bedroomsInput.current?.focus()}
      />

      <TextField
        ref={bedroomsInput}
        value={bedrooms.toString()}
        onChangeText={(text) => setBedrooms(Number(text))}
        containerStyle={themed($textField)}
        label="Bedrooms"
        placeholder="Number of bedrooms"
        keyboardType="number-pad"
        onSubmitEditing={() => buildingSizeInput.current?.focus()}
      />

      <TextField
        ref={buildingSizeInput}
        value={buildingSize.toString()}
        onChangeText={(text) => setBuildingSize(Number(text))}
        containerStyle={themed($textField)}
        label="Building Size (sqft)"
        placeholder="Building size"
        keyboardType="number-pad"
        onSubmitEditing={() => cityInput.current?.focus()}
      />

      <TextField
        ref={cityInput}
        value={city}
        onChangeText={setCity}
        containerStyle={themed($textField)}
        label="City"
        placeholder="City"
        onSubmitEditing={() => descriptionInput.current?.focus()}
      />

      <TextField
        ref={descriptionInput}
        value={description}
        onChangeText={setDescription}
        containerStyle={themed($textField)}
        label="Description"
        placeholder="Property description"
        onSubmitEditing={() => emailInput.current?.focus()}
      />

      <TextField
        ref={imagesInput}
        value={images}
        onChangeText={setImages}
        containerStyle={themed($textField)}
        label="Images (comma-separated URLs)"
        placeholder="Image URLs"
        onSubmitEditing={() => landSizeInput.current?.focus()}
      />

      <TextField
        ref={landSizeInput}
        value={landSize.toString()}
        onChangeText={(text) => setLandSize(Number(text))}
        containerStyle={themed($textField)}
        label="Land Size (acres)"
        placeholder="Land size"
        keyboardType="number-pad"
        onSubmitEditing={() => pricesInput.current?.focus()}
      />

      <TextField
        ref={pricesInput}
        value={prices.USD.toString()}
        onChangeText={(text) => {
          setPrices({
            USD: Number(text),
            CAD: Number(text) * 1.42,
            EUR: Number(text) * 0.95,
          })
        }}
        containerStyle={themed($textField)}
        label="Price"
        keyboardType="number-pad"
        placeholder="Price of the property in USD"
        onSubmitEditing={() => propertyTypeInput.current?.focus()}
      />

      <TextField
        ref={propertyTypeInput}
        value={propertyType}
        onChangeText={setPropertyType}
        containerStyle={themed($textField)}
        label="Property Type"
        placeholder="Type of property"
        onSubmitEditing={() => stateInput.current?.focus()}
      />

      <TextField
        ref={stateInput}
        value={state}
        onChangeText={setState}
        containerStyle={themed($textField)}
        label="State"
        placeholder="State"
        onSubmitEditing={() => zipCodeInput.current?.focus()}
      />

      <TextField
        ref={zipCodeInput}
        value={zipCode}
        onChangeText={setZipCode}
        containerStyle={themed($textField)}
        label="Zip Code"
        placeholder="Zip code"
        keyboardType="number-pad"
        onSubmitEditing={() => urlInput.current?.focus()}
      />

      <TextField
        ref={urlInput}
        value={url}
        onChangeText={setUrl}
        containerStyle={themed($textField)}
        label="Property URL"
        placeholder="Listing URL"
      />

      <Button style={themed($button)} preset="reversed" onPress={createListing}>
        Create Listing
      </Button>

      <Button style={themed($button)} onPress={() => navigation.goBack()}>
        Go Back
      </Button>
    </Screen>
  )
})

// Styles
const $screenContentContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingVertical: spacing.xxl,
  paddingHorizontal: spacing.lg,
})

const $heading: ThemedStyle<TextStyle> = ({ spacing }) => ({
  marginBottom: spacing.sm,
})

const $subheading: ThemedStyle<TextStyle> = ({ spacing }) => ({
  marginBottom: spacing.lg,
})

const $textField: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginBottom: spacing.lg,
})

const $button: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginTop: spacing.sm,
})
