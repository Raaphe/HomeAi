import { Request, Response } from "express";
import RealtorApi from "../api/realtor.api.ts";
import realtorApi from "../api/realtor.api.ts";

export class RealtorController {

    public async getProperties(req: Request, res: Response): Promise<void> {
        try {
            const { zip_code } = req.params;
            const { number_of_listings } = req.body;

            if (!zip_code || isNaN(Number(zip_code))) {
                res.status(400).json({
                    message: 'Invalid zip_code provided. It must be a numeric string.'
                });
                return;
            }

            const numberOfListings = number_of_listings ? Number(number_of_listings) : undefined;

            if (numberOfListings !== undefined && isNaN(numberOfListings)) {
                res.status(400).json({
                    message: 'Invalid number_of_listings provided. It must be a numeric value.'
                });
                return;
            }

            const propertiesList = await RealtorApi.fetchPropertiesList(zip_code, numberOfListings);

            if (!propertiesList.length) {
                res.status(404).json({
                    message: `No properties found for the zip code: ${zip_code}`
                });
                return;
            }

            res.status(200).json({
                total_number_of_listings: propertiesList.length,
                listings: propertiesList
            });
        } catch (error: any) {
            console.error('Internal server error:', error);
            res.status(500).json({
                message: 'Internal server error.'
            });
        }
    }

    public async getPropertyDetails (req: Request, res: Response) {
        const {listingUrl} = req.query;

        if (!listingUrl || typeof listingUrl !== 'string') {
            return res.status(400).json({error: 'Invalid or missing listingUrl parameter.'});
        }

        try {
            const propertyDetails = await realtorApi.fetchPropertyDetails(listingUrl);

            if (propertyDetails) {
                return res.status(200).json(propertyDetails);
            } else {
                return res.status(404).json({message: 'No property details found for the given URL.'});
            }
        } catch (error) {
            console.error('Error in getPropertyDetails controller:', error);
            return res.status(500).json({error: 'Failed to fetch property details. Please try again later.'});
        }
    }
}
