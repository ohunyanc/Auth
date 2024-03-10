import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google"
import GithubProvider from "next-auth/providers/github"
import CredentialsProvider from "next-auth/providers/credentials";
import connectMongo from "@/database/connect";
import Users from "@/models/Schema";
import { compare } from "bcryptjs";

export default NextAuth({
    providers: [
        //google provider
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
        GithubProvider({
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET,
        }),

        CredentialsProvider({
            name: "Credentials",
            async authorize(credentials, req) {
                try {
                    await connectMongo();

                    // Check user existence
                    const result = await Users.findOne({ email: credentials.email });
                    if (!result) {
                        throw new Error("No user Found with Email, Please Register!");
                    }

                    // Compare password
                    const checkPassword = await compare(credentials.password, result.password);

                    // Incorrect password check
                    if (!checkPassword || result.email !== credentials.email) {
                        throw new Error("Username or Password doesn't Match");
                    }

                    return result;
                } catch (error) {
                    console.error("Error:", error);
                    throw new Error("Authentication Failed"); // You can customize this message as needed
                }
            }
        })

    ],
    secret: process.env.AUTH_SECRET,

})