import axios from "axios"
import Movie from "../models/Movie.js";
import Show from "../models/Show.js";
import { inngest } from "../inngest/index.js";
import https from 'https';

const agent = new https.Agent({
    rejectUnauthorized: false,
    family: 4,
    keepAlive: false // Disable keepAlive to prevent ECONNRESET on stale connections
});

// Helper function to fetch with retry logic
const fetchWithRetry = async (url, options, retries = 3) => {
    try {
        return await axios.get(url, options);
    } catch (error) {
        if (retries > 0 && (error.code === 'ECONNRESET' || error.code === 'ETIMEDOUT')) {
            console.log(`Retrying... (${retries} attempts left)`);
            await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second before retry
            return fetchWithRetry(url, options, retries - 1);
        }
        throw error;
    }
};

// API to get now playing movies from TMDB API
export const getNowPlayingMovies = async (req, res) => {
    try {
        // Calculate date range for "Now Playing" (e.g., last 45 days to next 2 days)
        const today = new Date();
        const minDate = new Date(today);
        minDate.setDate(today.getDate() - 45);
        const maxDate = new Date(today);
        maxDate.setDate(today.getDate() + 2);

        const formatDate = (date) => date.toISOString().split('T')[0];

        const { data } = await fetchWithRetry(`https://api.themoviedb.org/3/discover/movie?page=1&sort_by=primary_release_date.desc&release_date.gte=${formatDate(minDate)}&release_date.lte=${formatDate(maxDate)}&with_release_type=2|3&region=IN&with_original_language=hi|kn|en`, {
            headers: {
                Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            },
            httpsAgent: agent
        })

        const movies = data.results;
        res.json({ success: true, movies: movies })
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message })
    }
}

// API to get bollywood movies from TMDB API
export const getBollywoodMovies = async (req, res) => {
    try {
        // Calculate date range for "Now Playing" (e.g., last 45 days to next 2 days)
        const today = new Date();
        const minDate = new Date(today);
        minDate.setDate(today.getDate() - 45);
        const maxDate = new Date(today);
        maxDate.setDate(today.getDate() + 2);

        const formatDate = (date) => date.toISOString().split('T')[0];

        const { data } = await fetchWithRetry(`https://api.themoviedb.org/3/discover/movie?with_original_language=hi&page=1&sort_by=primary_release_date.desc&release_date.gte=${formatDate(minDate)}&release_date.lte=${formatDate(maxDate)}&with_release_type=2|3&region=IN`, {
            headers: {
                Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            },
            httpsAgent: agent
        })

        const movies = data.results;
        res.json({ success: true, movies: movies })
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message })
    }
}

// API to add a new show to the database
export const addShow = async (req, res) => {
    try {
        const { movieId, startDate, endDate, times, showPrice } = req.body

        let movie = await Movie.findById(movieId)

        if (!movie) {
            // Fetch movie details and credits from TMDB API
            const movieDetailsResponse = await fetchWithRetry(`https://api.themoviedb.org/3/movie/${movieId}`, {
                headers: {
                    Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                },
                httpsAgent: agent
            });

            const movieCreditsResponse = await fetchWithRetry(`https://api.themoviedb.org/3/movie/${movieId}/credits`, {
                headers: {
                    Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                },
                httpsAgent: agent
            });

            const movieVideosResponse = await fetchWithRetry(`https://api.themoviedb.org/3/movie/${movieId}/videos`, {
                headers: {
                    Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                },
                httpsAgent: agent
            });

            const movieApiData = movieDetailsResponse.data;
            const movieCreditsData = movieCreditsResponse.data;
            const movieVideosData = movieVideosResponse.data;

            const trailer = movieVideosData.results.find(video => video.type === "Trailer" && video.site === "YouTube");

            const movieDetails = {
                _id: movieId,
                title: movieApiData.title,
                overview: movieApiData.overview,
                poster_path: movieApiData.poster_path,
                backdrop_path: movieApiData.backdrop_path,
                genres: movieApiData.genres,
                casts: movieCreditsData.cast,
                release_date: movieApiData.release_date,
                original_language: movieApiData.original_language,
                tagline: movieApiData.tagline || "",
                vote_average: movieApiData.vote_average,
                runtime: movieApiData.runtime,
                trailer_path: trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : "",
            }

            // Add movie to the database
            movie = await Movie.create(movieDetails);
        }

        const showsToCreate = [];
        const start = new Date(startDate);
        const end = new Date(endDate);

        for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
            const dateStr = d.toISOString().split('T')[0];
            times.forEach((time) => {
                const dateTimeString = `${dateStr}T${time}`;
                showsToCreate.push({
                    movie: movieId,
                    showDateTime: new Date(dateTimeString),
                    showPrice,
                    occupiedSeats: {}
                })
            })
        }

        if (showsToCreate.length > 0) {
            await Show.insertMany(showsToCreate);
        }

        //  Trigger Inngest event
        await inngest.send({
            name: "app/show.added",
            data: { movieTitle: movie.title }
        })

        res.json({ success: true, message: 'Show Added successfully.' })
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message })
    }
}

// API to get all shows from the database
export const getShows = async (req, res) => {
    try {
        const shows = await Show.find({ showDateTime: { $gte: new Date() } }).populate('movie').sort({ showDateTime: 1 });

        // filter unique shows
        const uniqueShows = new Set(shows.map(show => show.movie))

        res.json({ success: true, shows: Array.from(uniqueShows) })
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
}

// API to get a single show from the database
export const getShow = async (req, res) => {
    try {
        const { movieId } = req.params;
        // get all upcoming shows for the movie
        const shows = await Show.find({ movie: movieId, showDateTime: { $gte: new Date() } })

        let movie = await Movie.findById(movieId);

        if (movie && !movie.trailer_path) {
            try {
                const movieVideosResponse = await fetchWithRetry(`https://api.themoviedb.org/3/movie/${movieId}/videos`, {
                    headers: {
                        Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                    },
                    httpsAgent: agent
                });
                const movieVideosData = movieVideosResponse.data;
                const trailer = movieVideosData.results.find(video => video.type === "Trailer" && video.site === "YouTube");

                if (trailer) {
                    movie.trailer_path = `https://www.youtube.com/watch?v=${trailer.key}`;
                    await movie.save();
                }
            } catch (err) {
                console.error("Failed to fetch trailer for existing movie:", err);
            }
        }

        const dateTime = {};

        shows.forEach((show) => {
            const date = show.showDateTime.toISOString().split("T")[0];
            if (!dateTime[date]) {
                dateTime[date] = []
            }
            dateTime[date].push({ time: show.showDateTime, showId: show._id })
        })

        res.json({ success: true, movie, dateTime })
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
}