import { useEffect, useState } from "react";
import * as Location from "expo-location";
import { Text, View, StyleSheet, TouchableOpacity, TextInput, Image as RNImage } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { RealEstateAPIApi } from "@/api/generated-client";
import { useAppTheme } from "@/utils/useAppTheme";
import { useNavigation } from "@react-navigation/native";
import { useStores } from "../models"

export const CommunityScreen = () => {
  const { theme } = useAppTheme();
  const navigation = useNavigation();
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [zipCode, setZipCode] = useState<string>("");
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedListingIndex, setSelectedListingIndex] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  const [searchValue, setSearchValue] = useState<string>("");

  const {
    authenticationStore: { authEmail, setAuthEmail, setAuthToken, authToken, validationError },
  } = useStores()

  const getUserPosition = async (): Promise<void> => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setError("Location permission not granted");
        return;
      }
      const tempLocation = await Location.getCurrentPositionAsync({});
      setLocation(tempLocation);
    } catch (error) {
      setError("Error fetching user location");
      console.error(error);
    }
  };

  const getZipCode = async (): Promise<void> => {
    if (!location) return;

    try {
      const { latitude, longitude } = location.coords;
      const response = await Location.reverseGeocodeAsync({ latitude, longitude });
      const tempZip = response[0]?.postalCode || "";
      setZipCode(tempZip);
    } catch (error) {
      setError("Error fetching zip code");
      console.error(error);
    }
  };

  const getListings = async (zipCode: string): Promise<void> => {
    if (!zipCode) return;

    try {
      const response = await new RealEstateAPIApi().listingsAvailableZipCodePost(zipCode, { number_of_listings: 50 });
      const listingsData = response.data.data || [];

      const listingsWithCoords = await Promise.all(
        listingsData.map(async (listing: any) => {
          const address = `${listing.address}, ${listing.city}, ${listing.state} ${listing.zip}`;
          const geocodeResults = await Location.geocodeAsync(address);
          const coords = geocodeResults[0] || null;
          return { ...listing, coords };
        })
      );

      setListings(listingsWithCoords.filter(listing => listing.coords));
    } catch (error) {
      setError("Error fetching listings");
      console.error(error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await getUserPosition();
    };
    
    fetchData();
  }, []);

  useEffect(() => {
    if (location) {
      getZipCode();
    }
  }, [location]);

  useEffect(() => {
    if (zipCode) {
      getListings(zipCode).finally(() => setLoading(false));
    }
    console.log(listings)
  }, [zipCode]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={[styles.loadingText, { color: theme.colors.text }]}>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={[styles.errorText, { color: theme.colors.error }]}>{error}</Text>
      </View>
    );
  }

  const selectedListing = listings[selectedListingIndex];

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: location?.coords.latitude || 37.7749,
          longitude: location?.coords.longitude || -122.4194,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        showsUserLocation={true}
        provider="google"
      >
        {listings.map((listing, index) => {
          const isSelected = index === selectedListingIndex;
          const iconColor = isSelected ? theme.colors.background : "#008CBA";

          return (
            <Marker
              key={index}
              coordinate={{
                latitude: listing?.coords?.latitude || 0,
                longitude: listing?.coords?.longitude || 0,
              }}
              title={`${listing.address}`}
              onPress={() => {
                setSelectedListingIndex(index);
              }}
            >
              <RNImage
                source={require('../../assets/images/house-icon.png')}
                style={[styles.icon, { width: 20, height: 20, tintColor: iconColor }]} // Dynamic icon color based on theme
              />
            </Marker>
          );
        })}
      </MapView>

      <View style={[styles.detailContainer, { backgroundColor: theme.colors.background }]}>
        {listings.length > 0 ? (
          <View>
            <Text style={[styles.detailTitle, { color: theme.colors.text }]}>
              {selectedListing.address},{" "}
              <Text style={[styles.detailLocation, { color: theme.colors.text }]}>
                {selectedListing.city}, {selectedListing.state}
              </Text>
            </Text>

            <View style={styles.infoContainer}>
              <RNImage source={{ uri: selectedListing.image }} style={styles.listingImage} />
              <View style={styles.textContainer}>
                <Text style={[styles.priceText, { color: theme.colors.text }]}>
                  ${selectedListing.prices.USD.toLocaleString()} USD
                </Text>
                <Text style={[styles.propertyType, { color: theme.colors.text }]}>
                  {selectedListing.property_type}
                </Text>
                <Text style={[styles.propertyDetails, { color: theme.colors.text }]}>
                  {selectedListing.bedrooms} Beds - {selectedListing.bathrooms} Baths
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={[styles.viewButton, { backgroundColor: theme.colors.text }]}
              onPress={() => {
                navigation.navigate('ListingDetails', { url: listings[selectedListingIndex].url });
              }}
            >
              <Text style={[styles.viewButtonText, { color: theme.colors.background }]}>View Details</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <Text style={[styles.noListingsText, { color: theme.colors.text }]}>No listings found for this zip code.</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchBarContainer: {
    position: "absolute",
    marginTop: "12%",
    top: 10,
    left: 20,
    right: 20,
    zIndex: 1,
  },
  searchBar: {
    height: 40,
    borderRadius: 20,
    paddingLeft: 10,
    borderWidth: 1,
    fontWeight: "bold",
    fontSize: 18,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 20,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    textAlign: "center",
  },
  noListingsText: {
    fontSize: 18,
    textAlign: "center",
    marginTop: 20,
  },
  map: {
    flex: 1,
  },
  detailContainer: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    padding: 16,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#ddd",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  detailTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 8,
  },
  detailLocation: {
    fontSize: 16,
  },
  infoContainer: {
    flexDirection: "row",
    marginBottom: 16,
    alignItems: "center",
  },
  listingImage: {
    width: 100,
    height: 75,
    borderRadius: 8,
    marginRight: 16,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  textContainer: {
    flex: 1,
  },
  priceText: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 4,
  },
  propertyType: {
    fontSize: 16,
    marginBottom: 4,
  },
  propertyDetails: {
    fontSize: 14,
  },
  viewButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  viewButtonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  icon: {
    width: 20,
    height: 20,
  },
});
