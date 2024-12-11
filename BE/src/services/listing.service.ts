import ResponseObject from "../interfaces/response.interface.ts";
import User from "../models/user.model.ts";
import {IProperty} from "../interfaces/listing.interface.ts";

export default class ListingService {

    public static async getAllListings(): Promise<ResponseObject<IProperty[] | null>> {
        try {
            const users = await User.find({}, 'listings');
            const listings = users.flatMap(u => u.listings);

            return {
                code: 200,
                message: "Successfully fetched listings",
                data: listings
            };
        } catch (e: any) {
            return {
                code: 500,
                message: "Error fetching listings.",
                data: null
            };
        }
    }

}