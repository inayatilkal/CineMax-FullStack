import { createClerkClient } from '@clerk/express';
import 'dotenv/config';

const clerkClient = createClerkClient({
    secretKey: process.env.CLERK_SECRET_KEY,
    publishableKey: process.env.CLERK_PUBLISHABLE_KEY
});

async function testClerk() {
    try {
        console.log("Testing Clerk with null userId...");
        await clerkClient.users.getUser(null);
    } catch (error) {
        console.log("Error caught:");
        console.log(error.message);
        if (error.message.includes("A valid resource ID is required")) {
            console.log("MATCH FOUND!!!");
        }
        console.log(JSON.stringify(error, null, 2));
    }

    try {
        console.log("Testing Clerk with empty string userId...");
        await clerkClient.users.getUser("");
    } catch (error) {
        console.log("Error caught for empty string:");
        console.log(error.message);
    }
}

testClerk();
