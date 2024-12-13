import { Router } from 'express';
import { SoldPropertyController } from "../controllers/sold-property.controller.ts";

const router = Router();
const soldPropertyController = new SoldPropertyController();

/**
 * @swagger
 * /history/average-price-by-bathrooms:
 *   get:
 *     tags:
 *       - Historic data
 *     summary: Get average price by bathrooms
 *     description: Returns the average price of properties grouped by the number of bathrooms.
 *     responses:
 *       200:
 *         description: A list of properties with average prices by bathrooms.
 *       500:
 *         description: Internal server error
 */
router.get('/history/average-price-by-bathrooms', soldPropertyController.getAveragePriceByBathrooms);

/**
 * @swagger
 * /history/average-price-by-bedrooms:
 *   get:
 *     tags:
 *       - Historic data
 *     summary: Get average price by bedrooms
 *     description: Returns the average price of properties grouped by the number of bedrooms.
 *     responses:
 *       200:
 *         description: A list of properties with average prices by bedrooms.
 *       500:
 *         description: Internal server error
 */
router.get('/history/average-price-by-bedrooms', soldPropertyController.getAveragePriceByBedrooms);

/**
 * @swagger
 * /history/average-price-by-state:
 *   get:
 *     tags:
 *       - Historic data
 *     summary: Get average price by state
 *     description: Returns the average price of properties for each state.
 *     responses:
 *       200:
 *         description: A list of properties with average prices by state.
 *       500:
 *         description: Internal server error
 */
router.get('/history/average-price-by-state', soldPropertyController.getAveragePriceByState);

/**
 * @swagger
 * /history/properties-count-by-size:
 *   get:
 *     tags:
 *       - Historic data
 *     summary: Get property count by size
 *     description: Returns the count of properties grouped by their size.
 *     responses:
 *       200:
 *         description: A list of properties grouped by size.
 *       500:
 *         description: Internal server error
 */
router.get('/history/properties-count-by-size', soldPropertyController.getPropertyCountBySize);

/**
 * @swagger
 * /history/properties-count-by-state:
 *   get:
 *     tags:
 *       - Historic data
 *     summary: Get property count by state
 *     description: Returns the count of properties for each state.
 *     responses:
 *       200:
 *         description: A list of properties grouped by state.
 *       500:
 *         description: Internal server error
 */
router.get('/history/properties-count-by-state', soldPropertyController.getPropertyCountByState);

/**
 * @swagger
 * /history/sales-by-year:
 *   get:
 *     tags:
 *       - Historic data
 *     summary: Get sales by year
 *     description: Returns the number of sales of properties grouped by year.
 *     responses:
 *       200:
 *         description: A list of property sales by year.
 *       500:
 *         description: Internal server error
 */
router.get('/history/sales-by-year', soldPropertyController.getSalesByYear);

export default router;
