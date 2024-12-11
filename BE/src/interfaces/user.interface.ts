import { ObjectId } from 'mongodb';

export interface IUser {
  _id: string;
  username: string;
  password: string;
  name: string;
  role: string;
  listings?: ObjectId[];
}
