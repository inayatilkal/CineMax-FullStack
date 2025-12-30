import { createClerkClient } from '@clerk/express';
import 'dotenv/config';

const clerkClient = createClerkClient({
    secretKey: process.env.CLERK_SECRET_KEY,
    publishableKey: process.env.CLERK_PUBLISHABLE_KEY
});

async function setAdminRole() {
    const userId = 'user_36CbnfeSBWkLczlPgH3aGfcfpnn'; // cdevalatkar@gmail.com
    try {
        console.log(`Updating metadata for user ${userId}...`);
        await clerkClient.users.updateUserMetadata(userId, {
            privateMetadata: {
                role: 'admin'
            }
        });
        console.log("Successfully updated user metadata to admin.");
    } catch (error) {
        console.error("Error updating user:", error);
    }
}

setAdminRole();
