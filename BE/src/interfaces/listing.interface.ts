import { ObjectId } from 'mongodb';

export interface IProperty {
  _id: string;
  user_id: string;
  property_id: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  property_type: string;
  bedroom_count: number;
  bathroom_count: number;
  property_size: number;
  building_size: number;
  price: number;
  image: string;
}
