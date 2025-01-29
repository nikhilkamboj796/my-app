import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  provider: "credentials" | "google" | "facebook";
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    provider: { type: String, enum: ["credentials", "google", "facebook"], required: true },
  },
  { timestamps: true }
);

export const User = mongoose?.models?.User || mongoose.model<IUser>("User", UserSchema);