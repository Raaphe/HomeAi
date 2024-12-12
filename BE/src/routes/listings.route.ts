import {Router} from "express";
import { ListingsController } from "../controllers/listings.controller.ts";

const router = Router();

/**
 * @swagger
 * /listing:
 *   post:
 *     tags:
 *       - Listings
 *     summary: Create a new listing for a user
 *     description: Adds a new property listing to a user's profile.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Email of the user to associate the listing with.
 *                 example: "user@example.com"
 *               zip_code:
 *                 type: string
 *                 description: Zip code of the property.
 *                 example: "12345"
 *               bathrooms:
 *                 type: integer
 *                 description: Number of bathrooms.
 *                 example: 2
 *               land_size:
 *                 type: number
 *                 description: Size of the land in square meters.
 *                 example: 1500
 *               state:
 *                 type: string
 *                 description: State where the property is located.
 *                 example: "California"
 *               city:
 *                 type: string
 *                 description: City where the property is located.
 *                 example: "San Francisco"
 *               building_size:
 *                 type: number
 *                 description: Size of the building in square meters.
 *                 example: 200
 *               property_type:
 *                 type: string
 *                 description: Type of the property.
 *                 example: "Apartment"
 *               address:
 *                 type: string
 *                 description: Address of the property.
 *                 example: "123 Main St"
 *               property_id:
 *                 type: string
 *                 description: Unique identifier for the property.
 *                 example: "PROP123"
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   example: "https://example.com/image.jpg"
 *               bedrooms:
 *                 type: integer
 *                 description: Number of bedrooms.
 *                 example: 3
 *               url:
 *                 type: string
 *                 description: URL of the property listing.
 *                 example: "https://example.com/listing"
 *               description:
 *                 type: string
 *                 description: Description of the property.
 *                 example: "Beautiful apartment with sea view."
 *               prices:
 *                 type: object
 *                 description: Pricing information for the property.
 *                 example: { "USD": 176000, "CAD": 250000 }
 *     responses:
 *       "201":
 *         description: Listing created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 201
 *                 message:
 *                   type: string
 *                   example: "Created listing"
 *                 data:
 *                   type: boolean
 *                   example: true
 *       "400":
 *         description: Bad Request - Missing required fields or email not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 400
 *                 message:
 *                   type: string
 *                   example: "Error adding listing, provided email does not exist."
 *                 data:
 *                   type: boolean
 *                   example: false
 *       "500":
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 500
 *                 message:
 *                   type: string
 *                   example: "Error creating listing."
 *                 data:
 *                   type: boolean
 *                   example: false
 */
router.post("/listing", ListingsController.CreateListing)

export default router;