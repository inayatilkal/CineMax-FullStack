import 'dotenv/config';
import { createClerkClient } from '@clerk/express';

const clerkClient = createClerkClient({
    secretKey: process.env.CLERK_SECRET_KEY,
    publishableKey: process.env.CLERK_PUBLISHABLE_KEY
});

const token = "eyJhbGciOiJSUzI1NiIsImNhdCI6ImNsX0I3ZDRQRDExMUFBQSIsImtpZCI6Imluc18zNWJ1SHRFdktyWHB1MTB6bVRsdUZYMDAyOUEiLCJ0eXAiOiJKV1QifQ.eyJhenAiOiJodHRwOi8vbG9jYWxob3N0OjUxNzMiLCJleHAiOjE3NjQ2NzA2NzksImZ2YSI6WzAsLTFdLCJpYXQiOjE3NjQ2NzA2MTksImlzcyI6Imh0dHBzOi8vYWJzb2x1dGUtb3Bvc3N1bS01NS5jbGVyay5hY2NvdW50cy5kZXYiLCJuYmYiOjE3NjQ2NzA2MDksInNpZCI6InNlc3NfMzZIanU4bHBFczBSaEpidzEwVVQ4Q0Y5VjF6Iiwic3RzIjoiYWN0aXZlIiwic3ViIjoidXNlcl8zNWJ4QUxCblZLMjBKVmRBb1ZsZFBCM3VPRzIiLCJ2IjoyfQ.Bp4oN5KG_Ry-xR-WKxeBjkuoody-csyu7CK1-E56oyoVacyvqV2jHwSDDj7fe6-TFK7q4FVvobztDcP9_EYqHnXEPIDiCkbPo8m9atD1bRIKDqlpG0AbpCf7mrVhtr8zcQjGomg_SM8nDYxihx2XqSOs9sQVcLm3AX4s8vYO2B2trANwZi6tiql_meVFXjmVkNhem0kBI64SrlrOnIUrnJRo-1vaDh_k1kV9n83fRL_YJkbxhydG6QtgypM8racu8pP7BT_SfziCl1AUhDyGPRC8q_OI1TXbwtwPClbPcg0jcpUb3UkJYKDXknEzrtyoyzvVXeS-bxwZen6nFoijqA";

async function debugToken() {
    console.log("Checking keys...");
    console.log("CLERK_PUBLISHABLE_KEY exists:", !!process.env.CLERK_PUBLISHABLE_KEY);
    console.log("CLERK_SECRET_KEY exists:", !!process.env.CLERK_SECRET_KEY);

    if (process.env.CLERK_PUBLISHABLE_KEY) {
        console.log("PK prefix:", process.env.CLERK_PUBLISHABLE_KEY.substring(0, 15));
    }

    try {
        console.log("\nVerifying token with authenticateRequest...");

        // Mock a Request object (standard Request API)
        const req = new Request('http://localhost:3000/api/admin/is-admin', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const requestState = await clerkClient.authenticateRequest(req, {
            secretKey: process.env.CLERK_SECRET_KEY,
            publishableKey: process.env.CLERK_PUBLISHABLE_KEY,
            clockSkewInSeconds: 300
        });

        console.log("Authentication result:");
        console.log("isSignedIn:", requestState.isSignedIn);
        console.log("status:", requestState.status);
        console.log("reason:", requestState.reason);
        console.log("message:", requestState.message);

        if (requestState.isSignedIn) {
            console.log("User ID:", requestState.toAuth().userId);
        }

    } catch (error) {
        console.error("Token verification failed:");
        console.error(error.message);
        console.error("Full error:", JSON.stringify(error, null, 2));
    }
}

debugToken();
