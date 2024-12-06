import { Router } from 'express';
import { RealtorController } from '../controllers/realtor.controller.ts';

const router = Router();
const realtorController = new RealtorController();

/**
 * @swagger
 * /listings/available/{zip_code}:
 *   post:
 *     summary: Retrieve a list of available properties
 *     description: Retrieve a list of available properties based on the zip code and optionally the number of listings to retrieve.
 *     tags: [Real Estate API]
 *     parameters:
 *       - name: zip_code
 *         in: path
 *         description: The zip code to search for properties in.
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       description: Optional body parameter to specify the number of listings to retrieve.
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               number_of_listings:
 *                 type: integer
 *                 description: The number of listings to retrieve.
 *                 example: 25
 *     responses:
 *       200:
 *         description: A list of available properties based on the zip code and optional number of listings.
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
 *         description: No properties found for the given zip_code.
 *       500:
 *         description: Internal server error.
 */
router.post('/listings/available/:zip_code', realtorController.getProperties);

/**
 * @swagger
 * /listings/available/:
 *   get:
 *     summary: Fetch property details for a given listing URL.
 *     description: Retrieves detailed property information using the provided listing URL.
 *     tags: [Real Estate API]
 *     parameters:
 *       - in: query
 *         name: listingUrl
 *         required: true
 *         schema:
 *           type: string
 *         description: The URL of the property listing to fetch details for.
 *     responses:
 *       200:
 *         description: Successfully retrieved property details.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: Unique identifier of the listing.
 *                 title:
 *                   type: string
 *                   description: Title or name of the property listing.
 *                 price:
 *                   type: number
 *                   description: Price of the property.
 *                 location:
 *                   type: string
 *                   description: Location of the property.
 *                 [other_properties]:
 *                   description: Other relevant fields of the ListingDetailed object.
 *       400:
 *         description: Missing or invalid `listingUrl` query parameter.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Invalid or missing listingUrl parameter.
 *       404:
 *         description: No property details found for the given URL.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: No property details found for the given URL.
 *       500:
 *         description: Internal server error while fetching property details.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Failed to fetch property details. Please try again later.
 */
router.get('/listings/available/', realtorController.getPropertyDetails);

export default router;
