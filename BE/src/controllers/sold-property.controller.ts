import { SoldPropertyService } from "../services/sold-property.service.ts";
import { Request, Response } from 'express';

export class SoldPropertyController {
    private static GRAPH_DATA_PATH = '../data/graph-data.json'

    public async getCountByState(req: Request, res: Response): Promise<void> {
        try {
            const data = await SoldPropertyService.readPropertyCountByStateFromFile(SoldPropertyController.GRAPH_DATA_PATH);
            res.status(200).json(data);
        } catch (error) {
            console.error("Error getting price range by state", error);
            res.status(500).send("Error reading price range data.");
        }
    }

    public async getAveragePriceByState(req: Request, res: Response): Promise<void> {
        try {
            const data = await SoldPropertyService.readAveragePriceByStateFromFile(SoldPropertyController.GRAPH_DATA_PATH);
            res.status(200).json(data);
        } catch (error) {
            console.error("Error getting average price by state", error);
            res.status(500).send("Error reading average price data.");
        }
    }

    public async getPropertyCountByState(req: Request, res: Response): Promise<void> {
        try {
            const data = await SoldPropertyService.readPropertyCountByStateFromFile(SoldPropertyController.GRAPH_DATA_PATH);
            res.status(200).json(data);
        } catch (error) {
            console.error("Error getting property count by state", error);
            res.status(500).send("Error reading property count data.");
        }
    }

    public async getPropertyCountBySize(req: Request, res: Response): Promise<void> {
        try {
            const data = await SoldPropertyService.readPropertyCountBySizeFromFile(SoldPropertyController.GRAPH_DATA_PATH);
            res.status(200).json(data);
        } catch (error) {
            console.error("Error getting property count by size", error);
            res.status(500).send("Error reading property count by size data.");
        }
    }

    public async getAveragePriceByBedrooms(req: Request, res: Response): Promise<void> {
        try {
            const data = await SoldPropertyService.readAveragePriceByBedroomsFromFile(SoldPropertyController.GRAPH_DATA_PATH);
            res.status(200).json(data);
        } catch (error) {
            console.error("Error getting average price by bedrooms", error);
            res.status(500).send("Error reading average price by bedrooms data.");
        }
    }

    public async getAveragePriceByBathrooms(req: Request, res: Response): Promise<void> {
        try {
            const data = await SoldPropertyService.readAveragePriceByBathroomsFromFile(SoldPropertyController.GRAPH_DATA_PATH);
            res.status(200).json(data);
        } catch (error) {
            console.error("Error getting average price by bathrooms", error);
            res.status(500).send("Error reading average price by bathrooms data.");
        }
    }

    public async getSalesByYear(req: Request, res: Response): Promise<void> {
        try {
            const data = await SoldPropertyService.readSalesByYearFromFile(SoldPropertyController.GRAPH_DATA_PATH);
            res.status(200).json(data);
        } catch (error) {
            console.error("Error getting sales by year", error);
            res.status(500).send("Error reading sales by year data.");
        }
    }
}
