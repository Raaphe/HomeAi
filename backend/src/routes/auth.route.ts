import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';

const router = Router();

/**
 * @swagger
 * /auth:
 *   post:
 *     summary: Authenticate user
 *     security: []
 *     description: Authenticates a user with email and password, returning a JWT token upon success.
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's email address
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 description: User's password
 *                 example: P@ssw0rd123
 *     responses:
 *       200:
 *         description: Successfully authenticated user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Logged in Successfully
 *                 data:
 *                   type: string
 *                   description: JWT token for the authenticated user
 *                 code:
 *                   type: integer
 *                   example: 200
 *       400:
 *         description: Missing required fields or incorrect credentials
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Missing required fields
 *       500:
 *         description: Internal server error
 */
router.post('/auth', AuthController.Authenticate);

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Register a new user
 *     security: []
 *     description: Creates a new user account with the provided details.
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               first_name:
 *                 type: string
 *                 description: User's first name
 *                 example: John
 *               last_name:
 *                 type: string
 *                 description: User's last name
 *                 example: Doe
 *               company_name:
 *                 type: string
 *                 description: Name of the user's company (optional)
 *                 example: Acme Corp
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's email address
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 description: User's password
 *                 example: P@ssw0rd123
 *               phone:
 *                 type: string
 *                 description: User's phone number (optional)
 *                 example: "+1234567890"
 *               pfp:
 *                 type: string
 *                 format: uri
 *                 description: URL to the user's profile picture (optional)
 *                 example: "https://example.com/profile.jpg"
 *     responses:
 *       201:
 *         description: Successfully registered new user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: string
 *                   description: JWT token for the registered user
 *                 code:
 *                   type: integer
 *                   example: 201
 *                 message:
 *                   type: string
 *                   example: Successfully Registered.
 *       400:
 *         description: Missing required fields
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Missing required fields
 *                 code:
 *                   type: integer
 *                   example: 400
 *       500:
 *         description: Internal server error
 */
router.post('/register', AuthController.Register);

export default router;
