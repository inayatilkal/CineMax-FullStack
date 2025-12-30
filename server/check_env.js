import 'dotenv/config';

console.log("Checking Environment Variables...");
console.log("CLERK_PUBLISHABLE_KEY:", process.env.CLERK_PUBLISHABLE_KEY ? "Loaded" : "MISSING");
console.log("CLERK_SECRET_KEY:", process.env.CLERK_SECRET_KEY ? "Loaded (" + process.env.CLERK_SECRET_KEY.substring(0, 10) + "...)" : "MISSING");

if (!process.env.CLERK_SECRET_KEY) {
    console.error("ERROR: CLERK_SECRET_KEY is missing. Auth will fail.");
} else if (!process.env.CLERK_SECRET_KEY.startsWith('sk_')) {
    console.warn("WARNING: CLERK_SECRET_KEY does not start with 'sk_'. It might be invalid.");
} else {
    console.log("Environment variables look correct.");
}
