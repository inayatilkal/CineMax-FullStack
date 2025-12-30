import 'dotenv/config';
import connectDB from './configs/db.js';
import User from './models/User.js';
import { clerkClient } from './configs/clerk.js';

async function syncUsers() {
    await connectDB();

    console.log("Fetching users from Clerk...");
    try {
        const response = await clerkClient.users.getUserList({ limit: 100 });
        const users = response.data; // getUserList returns a paginated response object in newer SDKs, or array in older.
        // Checking if it's an array or object with data property
        const userList = Array.isArray(response) ? response : users;

        console.log(`Found ${userList.length} users in Clerk.`);

        for (const user of userList) {
            const userData = {
                _id: user.id,
                name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Unknown',
                email: user.emailAddresses[0]?.emailAddress || '',
                image: user.imageUrl || ''
            };

            await User.findByIdAndUpdate(user.id, userData, { upsert: true, new: true });
            console.log(`[SYNCED] User: ${userData.name} (${userData._id})`);
        }

        console.log("Sync complete!");
        process.exit();
    } catch (error) {
        console.error("Error syncing users:", error);
        process.exit(1);
    }
}

syncUsers();
