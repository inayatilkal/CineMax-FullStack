import { createClerkClient } from '@clerk/express';
import 'dotenv/config';

const clerkClient = createClerkClient({
    secretKey: process.env.CLERK_SECRET_KEY,
    publishableKey: process.env.CLERK_PUBLISHABLE_KEY
});

async function testClerkConnection() {
    try {
        console.log("Testing Clerk Connection...");
        const users = await clerkClient.users.getUserList({ limit: 1 });
        console.log("Connection Successful! Found " + users.data.length + " users.");
    } catch (error) {
        console.log("Connection Failed:");
        console.log(error.message);
    }
}

testClerkConnection();
