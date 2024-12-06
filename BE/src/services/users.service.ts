import ResponseObject from "../interfaces/response.interface";
import { IUser } from "../interfaces/user.interface";
import User from "../models/user.model";

export class UserService {
    
    static async getAllUsers(): Promise<ResponseObject<IUser[] | null>> {
        try {
            var users = await User.find();
            return {
                code: 200,
                message: "Successfully fetched users",
                data: users
            }
        } catch (e: any) {
            return {
                code: 500,
                message: "Error getting users.",
                data: null
            }
        }
    }
}