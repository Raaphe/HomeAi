import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';

export class AuthController {
    public static async Register(req: Request, res: Response): Promise<void> {
        const { first_name, last_name, company_name, email, password, phone, pfp } = req.body;
        if (!first_name || !last_name || !email || !password) {
            res.status(400).json({ message: 'Missing required fields', code: 400, data: null });
            return;
        }

        try {
            const serviceRes = await AuthService.register({
                username: email,
                company_name: company_name,
                first_name: first_name,
                last_name: last_name,
                password: password,
                phone_number: phone,
                profile_picture: pfp
            });

            res.status(serviceRes.code).json({
                data: serviceRes.data,
                code: serviceRes.code,
                message: serviceRes.message
            });
        } catch (error) {
            res.status(500).json({ message: 'Internal server error'});
        }
    }

    public static async Authenticate(req: Request, res: Response): Promise<void> {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ message: 'Missing required fields' });
            return;
        }

        try {
            const serviceRes = await AuthService.authenticate({
                username: email,
                password: password.trim(),
            });

            res.status(serviceRes.code).json({
                message: serviceRes.message,
                data: serviceRes.data,
                code: serviceRes.code
            });

        } catch (error) {
            res.status(500).json({ message: 'Internal server error', data: null, code: 500 });
        }
    }
}
