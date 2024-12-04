import { ListingDetailed, ListingOverview } from "../payloads/dto/listing.dto.ts";
import axios from "axios";

class RealtorApi {
    private baseUrl: string = "https://real-estate-api-xi.vercel.app";

    private static endpoints: any = {
        propertyListings: "/listings?zip_code={zip_code}&listings={number_of_listings}",
        propertyDetails: "/listing_detail?listing_url={listing_url}"
    };

    private getUrl(endpoint: keyof typeof RealtorApi.endpoints, params: Record<string, string | number>) {
        let url = this.baseUrl + RealtorApi.endpoints[endpoint];
        Object.keys(params).forEach(key => {
            url = url.replace(`{${key}}`, String(params[key]));
        });
        return url;
    }

    async fetchPropertiesList(zipCode: string, number_of_listings: number = 25) {
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

    async fetchPropertyDetails(listingUrl: string) {
        const url = this.getUrl('propertyDetails', { listing_url: listingUrl });

        try {
            const response = await axios.get<{
                listing?: ListingDetailed;
            }>(url);

            if (response.data.listing) {
                console.log('Fetched Property Details:', response.data.listing);
                return response.data.listing;
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