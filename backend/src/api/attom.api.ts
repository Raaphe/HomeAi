import axios from "axios";
import {config} from "../config/config.ts";

class AttomApi {
    static baseUrl: string = "https://api.gateway.attomdata.com/propertyapi/v1.0.0";

    private static endpoints: any = {
        propertyData: "/property/basicprofile",
    };

    static async fetchSoldProperties(address: string, city: string, stateCode: string) {
        try {
            const response = await axios.get(`${this.baseUrl}${this.endpoints.propertyData}`, {
                headers: {
                    Accept: "application/json",
                    apikey: config.ATTOM_API_KEY,
                },
                params: {
                    address1: address,
                    address2: `${city}, ${stateCode}`,
                },
            });

            const property = response.data?.property?.[0];

            if (!property) {
                throw new Error("No property data found for the given address.");
            }

            return {
                salePrice: property.sale?.saleAmountData?.saleAmt || null,
                marketValue: property.assessment?.market?.mktTtlValue || null,
                assessedValue: property.assessment?.assessed?.assdTtlValue || null,
                livingArea: property.building?.size?.livingSize || null,
                lotSize: property.lot?.lotSize2 || null,
                bedrooms: property.building?.rooms?.beds || null,
                bathrooms: property.building?.rooms?.bathsTotal || null,
                yearBuilt: property.summary?.yearBuilt || null,
                heating: property.utilities?.heatingType || null,
                material: property.utilities?.wallType || null,
                taxAmount: property.assessment?.tax?.taxAmt || null,
                latitude: property.location?.latitude || null,
                longitude: property.location?.longitude || null,
            };
        } catch (error) {
            console.error("Error fetching sold properties:", error);
            throw error;
        }
    }
}
