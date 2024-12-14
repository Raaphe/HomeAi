import { useEffect, useState } from "react";
import * as Location from "expo-location";
import { Text, View, StyleSheet } from "react-native";
import MapView from "react-native-maps";
import axios from "axios";

const ListingsMap = () => {
    const [location, setLocation] = useState<Location.LocationObject | null>(null);
    const [zipCode, setZipCode] = useState<string>("");
    const [listings, setListings] = useState<any>([]);
    const [loading, setLoading] = useState<boolean>(true);

    // Fetch user location
    const getUserPosition = async (): Promise<Location.LocationObject | null> => {
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") {
                console.warn("Location permission not granted");
                return null;
            }
            const tempLocation = await Location.getCurrentPositionAsync({});
            setLocation(tempLocation);
            return tempLocation;
        } catch (error) {
            console.error("Error fetching user location:", error);
            return null;
        }
    };

    // Fetch zip code using reverse geocoding
    const getZipCode = async (location: Location.LocationObject): Promise<string> => {
        try {
            const { latitude, longitude } = location.coords;
            const response = await Location.reverseGeocodeAsync({ latitude, longitude });
            const tempZip = response[0]?.postalCode || "";
            setZipCode(tempZip);
            return tempZip;
        } catch (error) {
            console.error("Error fetching zip code:", error);
            return "";
        }
    };

    // Fetch listings based on zip code
    const getListings = async (zip: string) => {
        console.log("Getting list of location:");

        if (!zip) return;

        console.log(`zip ${zip}`);

        try {
            const response = await axios.post(
                `https://homeaiservice.onrender.com/api/v1/listings/available/10001`,
                { number_of_listings: 25 },
                {
                    headers: {
                        accept: 'application/json',
                        'Content-Type': 'application/json',
                    },
                }
            );


            console.log("Fetched Listings:", response.data);
            setListings(response.data || []);
        } catch (error) {
            console.error("Error fetching listings:", error);
        }
    };

    useEffect(() => {
        const fetchLocationAndListings = async () => {
            setLoading(true);
            const userLocation = await getUserPosition();
            if (userLocation) {
                const tempZip = await getZipCode(userLocation);
                if (tempZip) {
                    await getListings(tempZip);
                }
            }
            setLoading(false);
        };

        fetchLocationAndListings();
    }, []);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Loading...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                initialRegion={{
                    latitude: location?.coords.latitude || 37.7749,
                    longitude: location?.coords.longitude || -122.4194,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }}
                showsUserLocation={true}
            />
            {listings.length > 0 && (
                <View style={styles.listingsContainer}>
                    <Text style={styles.listingsText}>
                        {listings.length} Listings found in zip code {zipCode}
                    </Text>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#121212",
    },
    loadingText: {
        color: "#ffffff",
        fontSize: 18,
    },
    listingsContainer: {
        position: "absolute",
        bottom: 20,
        left: 20,
        right: 20,
        padding: 10,
        backgroundColor: "rgba(0,0,0,0.6)",
        borderRadius: 10,
    },
    listingsText: {
        color: "#ffffff",
        textAlign: "center",
    },
});

export default ListingsMap;
