import { Request, Response } from 'express';
import CreateListingDTO from "../payloads/dto/createListing.dto.ts";
import ListingService from "../services/listing.service.ts";

export class ListingsController {
    static async CreateListing(req: Request, res: Response): Promise<Response> {
        try {
            const dto: CreateListingDTO = req.body;

            if (!dto.email) {
                return res.status(400).json({
                    code: 400,
                    message: "Email is required",
                    data: false,
                });
            }

            const result = await ListingService.createListing(dto);
            return res.status(result.code).json(result);
        } catch (error: any) {
            console.error('Error in createListing:', error.message);

            return res.status(500).json({
                code: 500,
                message: "Internal Server Error",
                data: false,
            });
        }
    }
}
