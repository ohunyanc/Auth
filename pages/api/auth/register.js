import connectMongo from "@/database/connect";
import Users from "@/models/Schema";
import { hash } from "bcryptjs";

export default async function handler(req, res) {
    try {
        await connectMongo();

        // Only post method is accepted
        if (req.method === 'POST') {
            if (!req.body) return res.status(404).json({ error: "Don't have form data...!" });

            const { username, email, password } = req.body;

            // Check duplicate users
            const existingUser = await Users.findOne({ email });
            if (existingUser) {
                return res.status(422).json({ message: "User Already exists" });
            }

            // Create new user
            const hashedPassword = await hash(password, 12);
            const newUser = await Users.create({ username, email, password: hashedPassword });

            res.status(201).json({ status: true, user: newUser });
        } else {
            res.status(500).json({ message: "HTTP method not valid, only POST accepted" });
        }
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}