import { GoogleGenerativeAI } from "@google/generative-ai";
import 'dotenv/config';

const listModels = async () => {
    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        console.log("Testing gemini-1.0-pro...");
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        const result = await model.generateContent("Hello");
        console.log("Response from gemini-1.0-pro:", result.response.text());

    } catch (error) {
        console.error("Error:", error.message);
    }
};

listModels();
