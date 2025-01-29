import { NextResponse } from "next/server";
import { connectDB } from "../../../../lib/mongoose";
import { User } from "../../../../lib/models/User";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  await connectDB();
  const { name, email, password } = await req.json();

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return NextResponse.json(
      { error: "Email already in use." },
      { status: 400 }
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  await new User({
    name,
    email,
    password: hashedPassword,
    provider: "credentials",
  }).save();

  return NextResponse.json(
    { message: "User registered successfully." },
    { status: 201 }
  );
}
