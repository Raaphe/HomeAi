import { ListingDetailed, ListingOverview } from "../payloads/dto/listing.dto.ts";
import axios from "axios";
import ListingService from "../services/listing.service.ts";
import InferenceService from "../services/inference.service.ts";
import HouseDTO from "../payloads/dto/houseInfo.dto.ts";

class RealtorApi {
    static baseUrl: string = "https://real-estate-api-xi.vercel.app";

    private static endpoints: any = {
        propertyListings: "/listings?zip_code={zip_code}&listings={number_of_listings}",
        propertyDetails: "/listing_detail?listing_url={listing_url}"
    };

    static getUrl(endpoint: keyof typeof RealtorApi.endpoints, params: Record<string, string | number>) {
        let url = this.baseUrl + RealtorApi.endpoints[endpoint];
        Object.keys(params).forEach(key => {
            url = url.replace(`{${key}}`, String(params[key]));
        });
        return url;
    }

    static async fetchPropertiesList(zipCode: string, number_of_listings: number = 25) {
        const url = this.getUrl('propertyListings', { zip_code: zipCode, number_of_listings: number_of_listings });
        let response;

        try {
            // Attempt to fetch listings from the API
            response = await axios.get<{
                listings?: ListingOverview[];
                total_number_of_listings?: number;
            }>(url);
        } catch (error) {
            // Handle API fetch errors gracefully
            console.error('Error fetching from API:', error);
            response = null;  // Set response to null if the API call fails
        }

        try {
            // If API response is not available or there are no listings, only return Mongoose listings if available
            if (!response || !response.data.listings) {
                console.log('API call failed or no listings found, returning MongoDB listings if available.');
                let mongooseListingRes = await ListingService.getAllListings();
                let mongooseListings = mongooseListingRes.data?.filter(l => l.zip_code === zipCode) ?? [];

                // Return only MongoDB listings if any exist
                if (mongooseListings.length > 0) {
                    console.log('Returning MongoDB listings:', mongooseListings);
                    return mongooseListings;
                } else {
                    console.log('No listings found in MongoDB either.');
                    return [];  // Return empty array if no listings are found
                }
            }

            // Continue if API has listings
            let mongooseListingRes = await ListingService.getAllListings();
            let mongooseListings = mongooseListingRes.data?.filter(l => l.zip_code === zipCode) ?? [];

            const mongooseCount = mongooseListings ? mongooseListings.length : 0;
            const apiCount = response.data.listings.length;

            const halfListings = Math.floor(number_of_listings / 2);

            let finalListings = [];
            if (mongooseCount >= halfListings && apiCount >= halfListings) {
                // If both sources have enough listings, fetch half from each
                finalListings = [
                    ...mongooseListings.slice(0, halfListings),
                    ...response.data.listings.slice(0, halfListings)
                ];
            } else if (mongooseCount >= halfListings) {
                // If MongoDB has enough listings, take the remainder from the API
                finalListings = [
                    ...mongooseListings.slice(0, halfListings),
                    ...response.data.listings.slice(0, number_of_listings - halfListings)
                ];
            } else if (apiCount >= halfListings) {
                // If API has enough listings, take the remainder from MongoDB
                finalListings = [
                    ...mongooseListings.slice(0, number_of_listings - halfListings),
                    ...response.data.listings.slice(0, halfListings)
                ];
            } else {
                // If both have fewer listings than expected, merge both sources until reaching the number of listings
                finalListings = [
                    ...mongooseListings.slice(0, mongooseCount),
                    ...response.data.listings.slice(0, number_of_listings - mongooseCount)
                ];
            }

            console.log('Fetched Listings:', finalListings);
            return finalListings;

        } catch (error) {
            console.error('Error processing property listings:', error);
            throw new Error('Failed to process property listings.');
        }
    }


    static async fetchPropertyDetails(listingUrl: string) : Promise<ListingDetailed | null> {
        const url = this.getUrl('propertyDetails', { listing_url: listingUrl });

        try {
            const response = await axios.get<{
                listing?: ListingDetailed;
            }>(url);

            if (response.data.listing) {
                let listingDetails = response.data.listing;

                const houseData: HouseDTO = {
                    state: listingDetails.state || "",
                    zip_code: Number(listingDetails.zip_code),
                    acres: listingDetails.land_size || 0,
                    bathrooms: listingDetails.bathrooms || 0,
                    bedrooms: listingDetails.bedrooms || 0,
                    living_space_size: listingDetails.building_size || 0,
                };

                const marketPrice = await InferenceService.getHouseInference(houseData);
                listingDetails.estimated_market_price = Number(marketPrice.data);

                console.log('Fetched Property Details:', response.data.listing);
                return listingDetails;
            } else {
                console.log('No details found for this listing.');
                return null;
            }
        } catch (error) {
            console.error('Error fetching property details:', error);
            throw new Error('Failed to fetch property details.');
        }
    }
}

export default RealtorApi;