import { Router } from 'express';
import { RealtorController } from '../controllers/realtor.controller.ts';

const router = Router();
const realtorController = new RealtorController();

/**
 * @swagger
 * /api/v1/listings/available/{zip_code}/{number_of_listings}:
 *   get:
 *     summary: Retrieve a list of available properties
 *     description: Retrieve a list of available properties based on zip code and the number of listings. The number of listings is specified as part of the URL path.
 *     tags: [Real Estate API]
 *     parameters:
 *       - name: zip_code
 *         in: path
 *         description: The zip code to search for properties in.
 *         required: true
 *         schema:
 *           type: string
 *       - name: number_of_listings
 *         in: path
 *         description: The number of listings to retrieve.
 *         required: true
 *         schema:
 *           type: integer
 *           example: 25
 *     responses:
 *       200:
 *         description: A list of available properties based on the zip code and number of listings.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total_number_of_listings:
 *                   type: integer
 *                   example: 25
 *                 listings:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: "1"
 *                       address:
 *                         type: string
 *                         example: "123 Main St"
 *                       city:
 *                         type: string
 *                         example: "Anytown"
 *                       state:
 *                         type: string
 *                         example: "CA"
 *                       zip_code:
 *                         type: string
 *                         example: "12345"
 *                       property_type:
 *                         type: string
 *                         example: "House"
 *                       bedrooms:
 *                         type: integer
 *                         example: 3
 *                       bathrooms:
 *                         type: integer
 *                         example: 2
 *                       building_size:
 *                         type: integer
 *                         example: 1500
 *                       prices:
 *                         type: object
 *                         additionalProperties:
 *                           type: integer
 *                         example: { "rent": 2000, "sale": 300000 }
 *                       image:
 *                         type: string
 *                         example: "http://example.com/image.jpg"
 *                       url:
 *                         type: string
 *                         example: "http://example.com/listing/1"
 *       400:
 *         description: Invalid zip_code or number_of_listings provided.
 *       404:
 *         description: No properties found for the given zip_code and number_of_listings.
 *       500:
 *         description: Internal server error.
 */
router.get('/listings/available/:zip_code/:number_of_listings', realtorController.getProperties);

export default router;
