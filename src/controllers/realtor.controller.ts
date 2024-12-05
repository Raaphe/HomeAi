import { Request, Response } from "express";
import RealtorApi from "../api/realtor.api.ts";

export class RealtorController {
    public async getProperties(req: Request, res: Response): Promise<void> {
        try {
            const { zip_code, number_of_listings } = req.params;  // Get zip_code and number_of_listings from path parameters

            if (!zip_code || isNaN(Number(zip_code))) {
                res.status(400).json({
                    message: 'Invalid zip_code provided. It must be a numeric string.'
                });
                return;  // Prevent further execution if the zip_code is invalid
            }

            const realtorApi = new RealtorApi();
            const propertiesList = await realtorApi.fetchPropertiesList(zip_code, Number(number_of_listings));

            if (!propertiesList.length) {
                res.status(404).json({
                    message: `No properties found for the zip code: ${zip_code}`
                });
                return;  // Prevent further execution if no properties are found
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
}
