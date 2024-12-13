import ResponseObject from "../interfaces/response.interface.ts";
import User from "../models/user.model.ts";
import {ListingDetailed} from "../payloads/dto/listing.dto.ts";
import CreateListingDTO from "../payloads/dto/createListing.dto.ts";
import {UserService} from "../services/users.service.ts"
import {IUser} from "../interfaces/user.interface.ts";

export default class ListingService {

    public static async getAllListings(): Promise<ResponseObject<ListingDetailed[] | null>> {
        try {
            const users = await User.find({}, 'listings');
            const listings = users.flatMap(u => u.listings ?? []);

            if (listings === undefined || listings.length === 0) {
                return {
                    code: 500,
                    message: "Error fetching listings.",
                    data: []
                };
            }

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

    public static async createListing(dto: CreateListingDTO) : Promise<ResponseObject<boolean>> {
        try {
            let user = await UserService.getUserByEmail(dto.email.trim()).then((user) => user.data);
            if (!user) {
                return {
                    code: 400,
                    message: "Error adding listing, provided email does not exist.",
                    data: false
                }
            }

            user.listings?.push({
                zip_code: dto.zip_code ?? "",
                bathrooms: dto.bathrooms ?? 0,
                land_size: dto.land_size ?? 0,
                state: dto.state ?? "",
                city: dto.city ?? "",
                building_size: dto.building_size ?? 0,
                property_type: dto.property_type ?? "",
                address: dto.address ?? "",
                property_id: dto.property_id ?? "",
                images: dto.images ?? [],
                bedrooms: dto.bedrooms ?? 0,
                url: dto.url ?? "",
                description: dto.description ?? "",
                prices: dto.prices ?? {},
            })

            var resEdit = await UserService.editUser(user);

            if (resEdit.code !== 200) {
                return {
                    code: resEdit.code,
                    data: false,
                    message: resEdit.message
                };
            }

            return  {
                code: 201,
                message: "Created listing",
                data: true
            }
        } catch (e: any) {
            return {
                code: 500,
                message: "Error creating listing.",
                data: false
            };
        }
    }

}