import { useEffect, useState } from "react";
import * as Location from "expo-location";
import { Text, View, StyleSheet, TouchableOpacity, Image as RNImage, Animated, TextInput } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { RealEstateAPIApi } from "@/api/generated-client";
import { GestureHandlerRootView, PanGestureHandler } from "react-native-gesture-handler";
import { GestureHandlerGestureEvent } from "react-native-gesture-handler";
import { SearchBar } from "react-native-elements";

interface Listing {
    address: string;
    city: string;
    state: string;
    zip: string;
    prices: {
        USD: number;
    };
    property_type: string;
    bedrooms: number;
    bathrooms: number;
    image: string;
    coords: Location.LocationObject | null;
}

const ListingsMap = () => {
    const [location, setLocation] = useState<Location.LocationObject | null>(null);
    const [zipCode, setZipCode] = useState<string>("");
    const [listings, setListings] = useState<Listing[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [selectedListingIndex, setSelectedListingIndex] = useState<number>(0);
    const [error, setError] = useState<string | null>(null);
    const translateX = useState(new Animated.Value(0))[0];  // Animation state for translation
    const [search, setSearch] = useState<string>(""); // Added search state

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
            const listingsData = response.data.listings || [];

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
    }, [zipCode]);

    useEffect(() => {
        Animated.timing(translateX, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
        }).start();
    }, [selectedListingIndex]);

    const onSwipe = (event: GestureHandlerGestureEvent) => {
        const translationX = event.nativeEvent.translationX;

        if (translationX < -100 && selectedListingIndex < listings.length - 1) {
            setSelectedListingIndex(prevIndex => prevIndex + 1);
        } else if (translationX > 100 && selectedListingIndex > 0) {
            setSelectedListingIndex(prevIndex => prevIndex - 1);
        }

        Animated.timing(translateX, {
            toValue: translationX,
            duration: 0,
            useNativeDriver: true,
        }).start();
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Loading...</Text>
            </View>
        );
    }

    const selectedListing = listings[selectedListingIndex];

    return (
        <View style={styles.container}>
            <SearchBar
                onFocus={() => console.log("Search bar focused")}
                value={search}  // assuming 'search' is the state variable for search query
                platform="default"  // 'default' for iOS and Android; you can also use 'ios' or 'android'
                searchIcon={{ size: 24 }}  // Customize the size of the search icon
                showLoading={loading}  // Display the loading spinner when data is being fetched
                lightTheme={false}  // Disable light theme to use the dark background
                round={true}
                containerStyle={{ backgroundColor: 'black' }}  // Set background color of the container to black
                inputStyle={{  color: 'white'}}  // Set input field background and text color
            />



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
                    const iconColor = isSelected ? "#ff6347" : "#008CBA"; // Color change for selected icon

                    return (
                        <Marker
                            key={index}
                            coordinate={{
                                latitude: listing?.coords?.latitude || 0,
                                longitude: listing?.coords?.longitude || 0,
                            }}
                            title={`${listing.address}`}
                            onPress={() => setSelectedListingIndex(index)}
                        >
                            <RNImage
                                source={require('@/assets/images/house-icon.png')}
                                style={[styles.icon, { width: 20, height: 20, tintColor: iconColor }]} // Dynamic icon size and color
                            />
                        </Marker>
                    );
                })}
            </MapView>

            <GestureHandlerRootView style={styles.gestureContainer}>
                <PanGestureHandler onGestureEvent={onSwipe}>
                    <Animated.View style={[styles.detailContainer, { transform: [{ translateX }] }]} >
                        {selectedListing && (
                            <>
                                <Text style={styles.detailTitle}>
                                    {selectedListing.address},{" "}
                                    <Text style={styles.detailLocation}>
                                        {selectedListing.city}, {selectedListing.state}
                                    </Text>
                                </Text>

                                <View style={styles.infoContainer}>
                                    <RNImage source={{ uri: selectedListing.image }} style={styles.listingImage} />
                                    <View style={styles.textContainer}>
                                        <Text style={styles.priceText}>
                                            ${selectedListing.prices.USD.toLocaleString()} USD
                                        </Text>
                                        <Text style={styles.propertyType}>{selectedListing.property_type}</Text>
                                        <Text style={styles.propertyDetails}>
                                            {selectedListing.bedrooms} Beds - {selectedListing.bathrooms} Baths
                                        </Text>
                                    </View>
                                </View>

                                <TouchableOpacity
                                    style={styles.viewButton}
                                    onPress={() => console.log("Viewing details for:", selectedListing)}
                                >
                                    <Text style={styles.viewButtonText}>View Details</Text>
                                </TouchableOpacity>
                            </>
                        )}
                    </Animated.View>
                </PanGestureHandler>
            </GestureHandlerRootView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f9f9f9",
    },
    map: {
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
    },
    loadingText: {
        fontSize: 20,
        color: "#333",
    },
    gestureContainer: {
        position: "absolute",
        bottom: 20,
        left: 20,
        right: 20,
        padding: 16,
        backgroundColor: "transparent",
    },
    detailContainer: {
        backgroundColor: "#fff",
        borderRadius: 15,
        borderWidth: 1,
        borderColor: "#ddd",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
        padding: 10,
    },
    detailTitle: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 8,
    },
    detailLocation: {
        fontSize: 16,
        color: "#777",
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
        color: "#007BFF",
        marginBottom: 4,
    },
    propertyType: {
        fontSize: 16,
        color: "#555",
        marginBottom: 4,
    },
    propertyDetails: {
        fontSize: 14,
        color: "#777",
    },
    viewButton: {
        backgroundColor: "#007BFF",
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
    },
    viewButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
    icon: {
        width: 20,
        height: 20,
    },
});

export default ListingsMap;
