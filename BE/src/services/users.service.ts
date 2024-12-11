import ResponseObject from "../interfaces/response.interface";
import { IUser } from "../interfaces/user.interface";
import User from "../models/user.model";

export class UserService {
    static async getAllUsers(): Promise<ResponseObject<IUser[] | null>> {
        try {
            const users = await User.find()
            return {
                code: 200,
                message: "Successfully fetched users",
                data: users
            };
        } catch (e: any) {
            return {
                code: 500,
                message: "Error getting users.",
                data: null
            };
        }
    }

    static async getUserByUsernameAndPassword(username: string, password: string): Promise<ResponseObject<IUser | undefined>> {
        try {
            const user = await User.findOne({ username });

            if (!user) {
                return {
                    code: 404,
                    data: undefined,
                    message: "No user found."
                };
            }

            if (user.password !== password) {
                return {
                    code: 401,
                    data: undefined,
                    message: "Incorrect password"
                };
            }

            return {
                code: 200,
                data: user,
                message: "User found"
            };
        } catch (e: any) {
            return {
                code: 500,
                message: "Error retrieving user.",
                data: undefined
            };
        }
    }
}