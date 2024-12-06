import { Request, Response } from "express";
import RealtorApi from "../api/realtor.api.ts";
import InferenceService from "../services/inference.service.ts";
import { logger } from "../utils/logger.ts";

export class RealtorController {
    public async getProperties(req: Request, res: Response): Promise<void> {
        try {
            const { zip_code, number_of_listings } = req.params;  // Get zip_code and number_of_listings from path parameters

            if (!zip_code || isNaN(Number(zip_code))) {
                res.status(400).json({
                    message: 'Invalid zip_code provided. It must be a numeric string.',
                    "code": 400,
                    "data": {}
                });
                return; 
            }

            const realtorApi = new RealtorApi();
            const propertiesList = await realtorApi.fetchPropertiesList(zip_code, Number(number_of_listings));

            if (!propertiesList.length) {
                res.status(404).json({
                    message: `No properties found for the zip code: ${zip_code}`,
                    "code": 404,
                    "data": {}
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
                message: 'Internal server error.',
                "code": 500,
                "data": {}
            });
        }
    }

    public async getMarketPrice(req: Request, res: Response): Promise<void> {    
        try {
            var {state, zip_code, bedrooms, bathrooms, living_space_size, acres} = req.body;

            if (
                !state ||
                !zip_code ||
                isNaN(Number(zip_code)) || 
                !bedrooms ||
                !bathrooms ||
                !living_space_size ||
                !acres
            ) {
                res.status(400).json({"message":"Invalid input: Some fields are missing or invalid.", "code": 400, "data": 0});
                return;
            }

            const result = await InferenceService.GetHouseInference(req.body);
            res.status(result.code).json(result);
        } catch (e) {
            logger.error("Error while making inference.\n" + e);
            res.status(500).json({"message":"Server Failure.", "code": 500, "data": 0});
        }
    }
}
