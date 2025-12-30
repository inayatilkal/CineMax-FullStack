import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { GoogleSearch } = require("google-search-results-nodejs");

export const findTheaters = async (req, res) => {
    const { movie, city } = req.query;

    if (!movie || !city) {
        return res.status(400).json({ error: "Movie and city are required" });
    }

    try {
        if (!process.env.SERPAPI_KEY) {
            console.error("SERPAPI_KEY is missing in environment variables.");
            return res.status(500).json({ error: "Server configuration error" });
        }

        const search = new GoogleSearch(process.env.SERPAPI_KEY);

        const getResults = () => {
            return new Promise((resolve, reject) => {
                search.json({
                    q: `${movie} showtimes in ${city}`,
                }, (data) => {
                    resolve(data);
                });
            });
        };

        const data = await getResults();

        let theaters = [];

        if (data.showtimes) {
            // showtimes usually contains an array of days, each with theaters, or just a flat list depending on the query
            // Actually, SerpApi 'showtimes' result structure:
            // data.showtimes[0].theaters[] -> each has .name
            // Or sometimes data.showtimes[] directly if no day grouping?
            // Let's assume standard structure: data.showtimes is an array of objects.
            // Often it's grouped by day. 
            // Let's inspect the structure safely.

            // If data.showtimes is array
            if (Array.isArray(data.showtimes)) {
                data.showtimes.forEach(dayOrTheater => {
                    if (dayOrTheater.theaters) {
                        // It's a day group
                        dayOrTheater.theaters.forEach(t => {
                            if (t.name) theaters.push(t.name);
                        });
                    } else if (dayOrTheater.name) {
                        // It's a theater directly
                        theaters.push(dayOrTheater.name);
                    }
                });
            }
        }

        // Fallback to local_results if showtimes are empty
        if (theaters.length === 0 && data.local_results) {
            if (Array.isArray(data.local_results)) {
                data.local_results.forEach(lr => {
                    if (lr.title) theaters.push(lr.title);
                });
            }
        }

        const uniqueTheaters = [...new Set(theaters)];

        res.json({ theaters: uniqueTheaters });

    } catch (error) {
        console.error("SerpApi Error:", error);
        res.status(500).json({ error: "Failed to fetch theaters" });
    }
};
