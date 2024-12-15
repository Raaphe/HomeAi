import React, { useEffect, useState } from "react";
import { View, Text, Image, ScrollView, StyleSheet, ActivityIndicator, TouchableOpacity } from "react-native";
import { useAppTheme } from "@/utils/useAppTheme";
import { RealEstateAPIApi } from "app/api/generated-client/api";

export const ListingDetails = ({ route }: any) => {
  const { url } = route.params;
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

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imageCarousel}>
        {images.length > 0 ? (
          images.map((image: string, index: number) => (
            <Image key={index} source={{ uri: image }} style={styles.image} />
          ))
        ) : (
          <Text style={[styles.noImageText, { color: theme.colors.text }]}>No Images Available</Text>
        )}
      </ScrollView>

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
        <Text style={[styles.contactText, { color: theme.colors.text }]}>
          {contact?.first_name} {contact?.last_name}
        </Text>
        <Text style={[styles.contactText, { color: theme.colors.text }]}>
          Agent: {contact?.first_name || "N/A"} {"\n"}Phone: {contact?.phone_number || "N/A"}
        </Text>
        <TouchableOpacity style={[styles.contactButton, { backgroundColor: theme.colors.background }]}>
          <Text style={[styles.contactButtonText, { color: theme.colors.text }]}>Contact Agent</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

// Reusable Info Block
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
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 40,
    marginBottom: 16,
    textAlign: "center", // This centers the title text
  },
  imageCarousel: {
    marginBottom: 16,
  },
  image: {
    width: 300,
    height: 200,
    borderRadius: 12,
    marginRight: 10,
  },
  noImageText: {
    fontSize: 16,
    textAlign: "center", // This centers the no image text
  },
  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },
  sectionTitle: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  price: {
    fontSize: 16,
    fontWeight: "600",
  },
  marketPrice: {
    marginTop: 8,
    fontSize: 14,
  },
  description: {
    alignSelf: "stretch",
    fontSize: 14,
    lineHeight: 20,
  },
  contactText: {
    textAlign: "center",
    fontSize: 14,
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
    fontWeight: "bold",
  },
  infoBlock: {
    textAlign: "center",
    width: "48%",
    marginBottom: 12,
  },
  infoLabel: {
    textAlign: "center",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
  },
  infoValue: {
    textAlign: "center",
    fontSize: 14,
  },
  detailsGrid: {
    textAlign: "center",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  skeletonContainer: {
    width: "100%",
    padding: 16,
    backgroundColor: "#ddd",
    borderRadius: 8,
    marginBottom: 16,
  },
  skeletonImage: {
    width: "100%",
    height: 150,
    backgroundColor: "#ccc",
    borderRadius: 8,
  },
  skeletonText: {
    height: 20,
    backgroundColor: "#eee",
    borderRadius: 4,
    marginVertical: 8,
  },
  skeletonButton: {
    height: 40,
    width: "50%",
    backgroundColor: "#bbb",
    borderRadius: 8,
    alignSelf: "center",
  },
});
