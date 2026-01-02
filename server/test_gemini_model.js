import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
dotenv.config();

const run = async () => {
    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // Use a known safe starter
        console.log("Checking API Key validity with a basic test...");

        const result = await model.generateContent("Hello, are you working?");
        console.log("Response:", result.response.text());

        console.log("\nAttempting to use configured model 'gemini-2.5-flash'...");
        try {
            const riskyModel = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
            const result2 = await riskyModel.generateContent("Test");
            console.log("gemini-2.5-flash works!");
        } catch (e) {
            console.error("gemini-2.5-flash FAILED:");
            console.error(e.message);
        }

    } catch (error) {
        console.error("General Error:", error.message);
    }
};

run();
