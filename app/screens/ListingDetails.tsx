import React, { useEffect, useState } from "react";
import { View, Text, Image, ScrollView, StyleSheet, ActivityIndicator, TouchableOpacity } from "react-native";
import { useAppTheme } from "@/utils/useAppTheme";
import { RealEstateAPIApi } from "app/api/generated-client/api";
import { useNavigation } from '@react-navigation/native';

export const ListingDetails = ({ route }: any) => {
  const navigation = useNavigation();
  const { jwt } = route.params;
  const { theme } = useAppTheme();
  const [listingDetails, setListingDetails] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await new RealEstateAPIApi().listingsAvailableGet(url);
        setListingDetails(response.data);
      } catch (error) {
        console.error("Error fetching details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [url]);

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.background} />
        <Text style={{ color: theme.colors.text }}>Loading...</Text>
      </View>
    );
  }

  if (!listingDetails) {
    return (
      <View style={[styles.center, { backgroundColor: theme.colors.background }]}>
        <Text style={{ color: theme.colors.text }}>
          Unable to load property details. Please try again later.
        </Text>
      </View>
    );
  }

  const {
    address,
    city,
    state,
    zip_code,
    description,
    images = [],
    bedrooms,
    bathrooms,
    building_size,
    land_size,
    property_type,
    prices,
    contact,
    estimated_market_price,
  } = listingDetails;

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header Section */}
      <Text style={[styles.title, { color: theme.colors.text }]}>
        {address}, {city}, {state} {zip_code}
      </Text>

      {/* Image Carousel */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imageCarousel}>
        {images.length > 0 ? (
          images.map((image: string, index: number) => (
            <Image key={index} source={{ uri: image }} style={styles.image} />
          ))
        ) : (
          <Text style={[styles.noImageText, { color: theme.colors.text }]}>No Images Available</Text>
        )}
      </ScrollView>

      {/* Details Section */}
      <View style={[styles.card, { backgroundColor: theme.colors.border }]}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Details</Text>
        <View style={styles.detailsGrid}>
          <InfoBlock label="Beds" value={bedrooms} />
          <InfoBlock label="Baths" value={bathrooms} />
          <InfoBlock label="Size" value={`${building_size || "N/A"} sq. ft.`} />
          <InfoBlock label="Land" value={`${land_size || "N/A"} acres`} />
          <InfoBlock label="Type" value={property_type} />
        </View>
      </View>

      {/* Pricing Section */}
      <View style={[styles.card, { backgroundColor: theme.colors.border }]}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Pricing</Text>
        <Text style={[styles.price, { color: theme.colors.text }]}>
          USD: ${prices?.USD?.toLocaleString() || "N/A"}
        </Text>
        <Text style={[styles.marketPrice, { color: theme.colors.text }]}>
          Estimated Market Price: ${estimated_market_price?.toLocaleString() || "N/A"}
        </Text>
        {prices?.USD && estimated_market_price && (
          <Text
            style={{
              color: estimated_market_price > prices.USD ? 'green' : 'red',
              fontWeight: 'bold',
              fontSize: 16,
              marginTop: 8,
            }}
          >
            {estimated_market_price > prices.USD 
              ? `+${((estimated_market_price - prices.USD) / prices.USD * 100).toFixed(2)}%`
              : `-${((prices.USD - estimated_market_price) / prices.USD * 100).toFixed(2)}%`}
          </Text>
        )}
      </View>

      {/* Description Section */}
      <View style={[styles.card, { backgroundColor: theme.colors.border }]}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Description</Text>
        <Text style={[styles.description, { color: theme.colors.text }]}>
          {description || "No description available."}
        </Text>
      </View>

      {/* Contact Section */}
      <View style={[styles.card, { backgroundColor: theme.colors.border }]}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Contact</Text>
        {contact ? (
          <>
            <Text style={[styles.contactText, { color: theme.colors.text }]}>
              {contact?.first_name} {contact?.last_name}
            </Text>
            <Text style={[styles.contactText, { color: theme.colors.text }]}>
              Agent: {contact?.first_name || "N/A"} {"\n"}Phone: {contact?.phone_number || "N/A"}
            </Text>
            <TouchableOpacity style={[styles.contactButton, { backgroundColor: theme.colors.background }]}>
              <Text style={[styles.contactButtonText, { color: theme.colors.text }]}>Contact Agent</Text>
            </TouchableOpacity>
          </>
        ) : (
          <Text style={[styles.contactText, { color: theme.colors.text }]}>
            No contact for this listing
          </Text>
        )}
      </View>
      <TouchableOpacity style={[styles.contactButton, { backgroundColor: theme.colors.background }]} onPress={() => navigation.goBack()}>
        <Text style={[styles.contactButtonText, { color: theme.colors.text }]}>Go back</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

// Reusable Info Block Component
const InfoBlock = ({ label, value }: { label: string; value: any }) => (
  <View style={styles.infoBlock}>
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={styles.infoValue}>{value || "N/A"}</Text>
  </View>
);

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginTop: 20,
    marginBottom: 16,
    textAlign: "center",
  },
  imageCarousel: {
    marginBottom: 20,
  },
  image: {
    width: 300,
    height: 200,
    borderRadius: 12,
    marginRight: 12,
    elevation: 5,
  },
  noImageText: {
    fontSize: 16,
    textAlign: "center",
  },
  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 5,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
  },
  sectionTitle: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },
  price: {
    fontSize: 18,
    fontWeight: "700",
  },
  marketPrice: {
    fontSize: 16,
    marginTop: 8,
  },
  description: {
    fontSize: 16,
    lineHeight: 22,
  },
  contactText: {
    textAlign: "center",
    fontSize: 16,
    marginBottom: 8,
  },
  contactButton: {
    marginTop: 12,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  contactButtonText: {
    fontSize: 16,
    fontWeight: "700",
  },
  infoBlock: {
    textAlign: "center",
    width: "48%",
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
  },
  detailsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
});
