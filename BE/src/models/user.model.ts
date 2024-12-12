import mongoose from 'mongoose';
import { IUser } from '../interfaces/user.interface';
import { IProperty } from "../interfaces/listing.interface.ts";
import { Price } from "../payloads/dto/listing.dto.ts";

const priceSchema = new mongoose.Schema<Price>({
  USD: { type: Number, min: 0 },
  CAD: { type: Number, min: 0 },
  EUR: { type: Number, min: 0 },
}, { _id: false });

const propertySchema = new mongoose.Schema<IProperty>({
  property_id: { type: String, maxlength: 50 },
  address: { type: String, maxlength: 255 },
  city: { type: String, maxlength: 100 },
  state: { type: String, maxlength: 100 },
  zip_code: { type: String, required: true, maxlength: 20 },
  property_type: { type: String, maxlength: 50 },
  building_size: { type: Number, min: 0 },
  land_size: { type: Number, min: 0 },
  description: { type: String, maxlength: 500 },
  images: [{ type: String }],
  bathrooms: { type: Number, min: 0 },
  bedrooms: { type: Number, min: 0 },
  prices: { type: priceSchema },
  url: { type: String, match: /^https?:\/\/[^\s$.?#].\S*$/i },
}, { _id: false });

const userSchema = new mongoose.Schema<IUser>({
  _id: { type: String, required: true },
  email: { type: String, unique: true, required: true, match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
  password: { type: String, required: true, minlength: 8 },
  role: { type: String, required: true, enum: ['admin', 'user', 'guest'] }, // REQUIRED END
  userName: { type: String, maxlength: 50, unique: true },
  company: { type: String, maxlength: 100 },
  company_url: { type: String, match: /^https?:\/\/[^\s$.?#].\S*$/i },
  first_name: { type: String, maxlength: 50 },
  last_name: { type: String, maxlength: 50 },
  phone_number: { type: String, maxlength: 15, match: /^\+?[0-9]{7,15}$/ },
  profile_pic: { type: String, match: /\.(jpg|jpeg|png|gif)$/i },
  listings: { type: [propertySchema], default: [] },
});

const User = mongoose.model<IUser>('users', userSchema);

export default User;
