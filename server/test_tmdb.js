import axios from "axios";
import https from 'https';
import dotenv from 'dotenv';
dotenv.config();

const agent = new https.Agent({
    rejectUnauthorized: false,
    family: 4,
    keepAlive: false
});

const fetchWithRetry = async (url, options, retries = 3) => {
    try {
        console.log(`Fetching: ${url}`);
        // Remove httpsAgent to test default behavior
        const { httpsAgent, ...restOptions } = options;
        return await axios.get(url, restOptions);
    } catch (error) {
        if (retries > 0 && (error.code === 'ECONNRESET' || error.code === 'ETIMEDOUT')) {
            console.log(`Retrying... (${retries} attempts left)`);
            await new Promise(resolve => setTimeout(resolve, 1000));
            return fetchWithRetry(url, options, retries - 1);
        }
        throw error;
    }
};

const run = async () => {
    try {
        const today = new Date();
        const minDate = new Date(today);
        minDate.setDate(today.getDate() - 45);
        const maxDate = new Date(today);
        maxDate.setDate(today.getDate() + 2);

        const formatDate = (date) => date.toISOString().split('T')[0];

        const url = `https://api.themoviedb.org/3/discover/movie?page=1&sort_by=primary_release_date.desc&release_date.gte=${formatDate(minDate)}&release_date.lte=${formatDate(maxDate)}&with_release_type=2|3&region=IN&with_original_language=hi|kn|en`;

        console.log(`URL: ${url}`);
        console.log(`Key length: ${process.env.TMDB_API_KEY?.length}`);

        const { data } = await fetchWithRetry(url, {
            headers: {
                Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            },
            httpsAgent: agent
        });

        console.log("Success!");
        console.log(`Found ${data.results.length} movies.`);
        data.results.forEach(m => console.log(`- ${m.title} (${m.release_date})`));

    } catch (error) {
        console.error("Error occurred:");
        if (error.response) {
            console.error("Status:", error.response.status);
            console.error("Data:", error.response.data);
        } else {
            console.error(error.message);
        }
    }
};

run();
