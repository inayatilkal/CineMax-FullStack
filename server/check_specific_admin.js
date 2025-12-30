import { createClerkClient } from '@clerk/express';
import 'dotenv/config';

const clerkClient = createClerkClient({
    secretKey: process.env.CLERK_SECRET_KEY,
    publishableKey: process.env.CLERK_PUBLISHABLE_KEY
});

async function checkSpecificUser() {
    const targetEmail = 'ckdevalatkar@gmail.com';
    try {
        console.log(`Checking status for ${targetEmail}...`);
        const users = await clerkClient.users.getUserList({ emailAddress: [targetEmail] });

        if (users.data.length === 0) {
            console.log("User not found.");
        } else {
            const user = users.data[0];
            console.log(`User Found: ${user.firstName} ${user.lastName}`);
            console.log(`ID: ${user.id}`);
            console.log(`Role: ${user.privateMetadata.role || 'NONE'}`);

            if (user.privateMetadata.role === 'admin') {
                console.log("✅ This user IS an admin.");
            } else {
                console.log("❌ This user is NOT an admin.");
            }
        }
    } catch (error) {
        console.error("Error fetching user:", error);
    }
}

checkSpecificUser();
