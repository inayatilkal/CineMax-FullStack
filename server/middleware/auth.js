import { clerkClient } from '../configs/clerk.js';

export const protectAdmin = async (req, res, next) => {
    try {
        const authState = req.auth();
        const { userId } = authState;

        if (!userId) {
            return res.json({ success: false, message: "not authorized" });
        }

        const user = await clerkClient.users.getUser(userId)

        if (user.privateMetadata.role !== 'admin') {
            return res.json({ success: false, message: "not authorized" })
        }

        next();
    } catch (error) {
        console.error("protectAdmin: Error:", error.message);
        return res.json({ success: false, message: "not authorized" });
    }
}
