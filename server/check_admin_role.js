import { createClerkClient } from '@clerk/express';
import 'dotenv/config';

const clerkClient = createClerkClient({
    secretKey: process.env.CLERK_SECRET_KEY,
    publishableKey: process.env.CLERK_PUBLISHABLE_KEY
});

async function checkUsers() {
    try {
        console.log("Fetching users...");
        const users = await clerkClient.users.getUserList({ limit: 10 });

        const userList = users.data.map(user => ({
            name: `${user.firstName} ${user.lastName}`,
            email: user.emailAddresses[0].emailAddress,
            id: user.id,
            role: user.privateMetadata.role || 'NONE'
        }));

        const fs = await import('fs');
        fs.writeFileSync('users.json', JSON.stringify(userList, null, 2));
        console.log("Users written to users.json");
    } catch (error) {
        console.error("Error fetching users:", error);
    }
}

checkUsers();
