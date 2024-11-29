import mongoose from 'mongoose';
import { IUser } from '../interfaces/user.interface';

const userSchema = new mongoose.Schema<IUser>({
  _id: { type: String, required: true },
  id: { type: Number, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, required: true },
  listings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'listings' }]
});

const User = mongoose.model<IUser>('users', userSchema);

export default User;
