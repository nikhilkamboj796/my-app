import jwt from "jsonwebtoken";

const SECRET = process.env.NEXTAUTH_SECRET as string;

// Generate JWT Token
export const generateToken = (payload: object) => {
  return jwt.sign(payload, SECRET, { expiresIn: "7d" });
};

// Verify JWT Token
export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, SECRET);
  } catch {
    return null;
  }
};