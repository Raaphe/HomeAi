import ResponseObject from "../interfaces/response.interface";
import { IUser } from "../interfaces/user.interface";
import User from "../models/user.model";

export class UserService {
    static async getAllUsers(): Promise<ResponseObject<IUser[] | null>> {
        try {
            const users = await User.find().select("-listings");
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

    static async getAllUsersWithListings(): Promise<ResponseObject<IUser[] | null>> {
        try {
            const users = await User.find();
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

    static async getUserByOID(objectId: string): Promise<ResponseObject<IUser | null>> {
        try {
            const user = await User.findById(objectId);
            return {
                code: 200,
                message: "Successfully fetched user",
                data: user
            };
        } catch (e: any) {
            return {
                code: 500,
                message: "Error getting user.",
                data: null
            };
        }
    }

    static async getUserByEmail(email: string): Promise<ResponseObject<IUser | null>> {
        try {
            const user = await User.findOne({ email });
            return {
                code: 200,
                message: "Successfully fetched user",
                data: user
            };
        } catch (e: any) {
            return {
                code: 500,
                message: "Error getting user.",
                data: null
            };
        }
    }

    static async deleteUserByOID(objectId: string): Promise<ResponseObject<IUser | null>> {
        try {
            const user = await User.findByIdAndDelete(objectId);
            return {
                code: 200,
                message: "Successfully deleted user",
                data: user
            };
        } catch (e: any) {
            return {
                code: 500,
                message: "Error deleting user.",
                data: null
            };
        }
    }

    static async editUser(user: IUser): Promise<ResponseObject<IUser | null>> {
        try {
            if (!user._id) {
                return {
                    code: 400,
                    message: "User ID is required for updating",
                    data: null
                };
            }

            const result = await User.updateOne({ _id: user._id }, { $set: user });

            if (result.matchedCount === 0) {
                return {
                    code: 404,
                    message: "User not found",
                    data: null
                };
            }

            const updatedUser = await User.findById(user._id);
            return {
                code: 200,
                message: "Successfully updated user",
                data: updatedUser
            };
        } catch (e: any) {
            return {
                code: 500,
                message: "Error updating user",
                data: null
            };
        }
    }
}