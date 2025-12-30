import axios from 'axios';

const testChat = async () => {
    try {
        const response = await axios.post('http://localhost:3000/api/cinebot/chat', {
            message: "Hello, I want to watch a movie.",
            history: []
        });
        console.log("Response:", response.data);
    } catch (error) {
        console.error("Error:", error.response ? error.response.data : error.message);
    }
};

testChat();
