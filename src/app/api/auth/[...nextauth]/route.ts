import { User as UserModel } from "../../../../lib/models/User";
import { connectDB } from "../../../../lib/mongoose";
import bcrypt from "bcryptjs";
import NextAuth, { NextAuthOptions, Session, User } from "next-auth";
import { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import FacebookProvider from "next-auth/providers/facebook";
import GoogleProvider from "next-auth/providers/google";

const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials): Promise<User | null> {
        if (!credentials?.email || !credentials.password) {
          throw new Error("Email and password are required.");
        }

        await connectDB();
        const user = await UserModel.findOne({ email: credentials.email });

        if (!user || !user.password) {
          throw new Error("User not found.");
        }

        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        );
        if (!isValid) {
          throw new Error("Invalid credentials.");
        }

        return { id: user._id.toString(), name: user.name, email: user.email };
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }: { token: JWT; user?: User; account?: any }) {
      await connectDB();

      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;

        // Detect provider type (credentials, google, facebook)
        const providerType = account?.provider === "google" ? "google" : account?.provider === "facebook" ? "facebook" : "credentials";

        // 🚀 Check if user exists in MongoDB (Google/Facebook Logins)
        const existingUser = await UserModel.findOne({ email: user.email });

        if (!existingUser) {
          console.log("New OAuth user detected, saving to DB...");
          const newUser = new UserModel({
            name: user.name,
            email: user.email,
            password: null, // OAuth users do not have passwords
            provider: providerType, // ✅ Correct provider type
          });
          await newUser.save();
          token.id = newUser._id.toString();
        } else {
          token.id = existingUser._id.toString();
        }
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (session.user) {
        // @ts-expect-error user can have multiple values
        session.user.id = token.id;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
