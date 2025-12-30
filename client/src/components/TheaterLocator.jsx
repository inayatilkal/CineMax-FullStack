import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MapPin, Navigation } from 'lucide-react';

const TheaterLocator = ({ movieTitle, city, onSelectTheater }) => {
    const [theaters, setTheaters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTheaters = async () => {
            if (!movieTitle || !city) {
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                // Using relative path assuming proxy is set up or CORS allows it.
                // If running locally, might need full URL if proxy isn't configured in Vite.
                // I'll use the full URL to be safe as per previous patterns or context.
                // The user's server is on port 3000.
                const response = await axios.get(`http://localhost:3000/api/find-theaters`, {
                    params: { movie: movieTitle, city }
                });

                setTheaters(response.data.theaters || []);
            } catch (err) {
                console.error("Error fetching theaters:", err);
                setError("Failed to load theaters.");
            } finally {
                setLoading(false);
            }
        };

        fetchTheaters();
    }, [movieTitle, city]);

    if (loading) return <div className="text-gray-400 animate-pulse mt-6">Finding theaters nearby...</div>;
    if (error) return <div className="text-red-400 text-sm mt-6">{error}</div>;
    if (theaters.length === 0) {
        if (city && movieTitle) {
            return <div className="text-gray-400 mt-6 text-center">No theaters found for this movie in selected location</div>;
        }
        return null;
    }

    return (
        <div className="mt-10 bg-gray-800/50 p-6 rounded-xl border border-gray-700/50 backdrop-blur-sm">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-rose-500" />
                Where to Watch in {city}
            </h3>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {theaters.map((theater, index) => (
                    <div key={index} className="group bg-gray-900/50 p-4 rounded-lg border border-gray-700 hover:border-rose-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-rose-500/10 flex flex-col justify-between">
                        <div>
                            <h4 className="font-medium text-gray-200 mb-2 truncate" title={theater}>{theater}</h4>
                            <a
                                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(theater + " " + city)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 text-xs font-medium text-rose-400 hover:text-rose-300 transition-colors mb-3"
                            >
                                <Navigation className="w-3 h-3" />
                                Get Directions
                            </a>
                        </div>
                        <button
                            onClick={() => onSelectTheater && onSelectTheater(theater)}
                            className="w-full mt-2 py-2 text-xs font-semibold bg-white text-black rounded hover:bg-gray-200 transition-colors cursor-pointer"
                        >
                            Book Here
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TheaterLocator;
