import mongoose, { Document } from "mongoose";

export interface IUser extends Document {
  username: string;
  email: string;
  fullname: string;
  avatar: string;
  coverImage: string;
  watchHistory: mongoose.Types.ObjectId[];
  password: string;
  refreshToken?: string;
  isPasswordCorrect(password: string): Promise<boolean>;
  generateAccessToken(): string;
  generateRefreshToken(): string;
}
