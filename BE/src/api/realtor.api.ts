import { ListingDetailed, ListingOverview } from "../payloads/dto/listing.dto.ts";
import axios from "axios";
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

        try {
            const response = await axios.get<{
                listings?: ListingOverview[];
                total_number_of_listings?: number;
            }>(url);

            if (response.data.listings) {
                console.log('Fetched Listings:', response.data.listings);
                return response.data.listings;
            } else {
                console.log('No listings found.');
                return [];
            }
        } catch (error) {
            console.error('Error fetching property listings:', error);
            throw new Error('Failed to fetch property listings.');
        }
    }

    static async fetchPropertyDetails(listingUrl: string) {
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