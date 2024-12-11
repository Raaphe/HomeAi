import mongoose from 'mongoose';
import { IProperty } from '../interfaces/listing.interface';

const propertySchema = new mongoose.Schema<IProperty>({
  _id: { type: String, required: true },
  user_id: { type: String, required: true },
  property_id: { type: String, required: true, unique: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zip_code: { type: String, required: true },
  property_type: { type: String, required: true },
  bedroom_count: { type: Number, required: true },
  bathroom_count: { type: Number, required: true },
  property_size: { type: Number, required: true },
  building_size: { type: Number, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true }
});

const Property = mongoose.model<IProperty>('listings', propertySchema);

export default Property;
