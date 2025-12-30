import { createClerkClient } from '@clerk/express';
import 'dotenv/config';

export const clerkClient = createClerkClient({
    secretKey: process.env.CLERK_SECRET_KEY,
    publishableKey: process.env.CLERK_PUBLISHABLE_KEY
});
