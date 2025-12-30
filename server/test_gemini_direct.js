import { GoogleGenerativeAI } from "@google/generative-ai";
import 'dotenv/config';
import fs from 'fs';

const testGeminiDirect = async () => {
    try {
        console.log("Testing API Key:", process.env.GEMINI_API_KEY);
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result = await model.generateContent("Hello");
        console.log("Response:", result.response.text());
    } catch (error) {
        const errorData = {
            message: error.message,
            stack: error.stack,
            response: error.response
        };
        fs.writeFileSync('output.json', JSON.stringify(errorData, null, 2));
        console.log("Error written to output.json");
    }
};

testGeminiDirect();
