import { ObjectId } from 'mongodb';

export interface IUser {
  _id: string;
  id: number;
  username: string;
  password: string;
  name: string;
  role: string;
  listings?: ObjectId[];
}
