import React, { useEffect, useState } from 'react'
import { dummyShowsData } from '../../assets/assets';
import Loading from '../../components/Loading';
import Title from '../../components/admin/Title';
import { CheckIcon, DeleteIcon, StarIcon } from 'lucide-react';
import { kConverter } from '../../lib/kConverter';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';

const AddShows = () => {

    const { axios, getToken, user, image_base_url } = useAppContext()

    const currency = import.meta.env.VITE_CURRENCY
    const [nowPlayingMovies, setNowPlayingMovies] = useState([]);
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [selectedTimes, setSelectedTimes] = useState([]);
    const [timeInput, setTimeInput] = useState("");
    const [showPrice, setShowPrice] = useState("");
    const [addingShow, setAddingShow] = useState(false)


    const fetchMovies = async () => {
        try {
            let endpoint = '/api/show/now-playing';

            const { data } = await axios.get(endpoint, {
                headers: { Authorization: `Bearer ${await getToken()}` }
            })
            if (data.success) {
                setNowPlayingMovies(data.movies)
            }
        } catch (error) {
            console.error('Error fetching movies:', error)
        }
    };

    const handleTimeAdd = () => {
        if (!timeInput) return;
        if (!selectedTimes.includes(timeInput)) {
            setSelectedTimes([...selectedTimes, timeInput]);
        }
        setTimeInput("");
    };

    const handleRemoveTime = (time) => {
        setSelectedTimes(selectedTimes.filter((t) => t !== time));
    };

    const handleSubmit = async () => {
        try {
            setAddingShow(true)

            if (!selectedMovie || !startDate || !endDate || selectedTimes.length === 0 || !showPrice) {
                return toast('Missing required fields');
            }

            const payload = {
                movieId: selectedMovie,
                startDate,
                endDate,
                times: selectedTimes,
                showPrice: Number(showPrice)
            }

            const { data } = await axios.post('/api/show/add', payload, { headers: { Authorization: `Bearer ${await getToken()}` } })

            if (data.success) {
                toast.success(data.message)
                setSelectedMovie(null)
                setStartDate("")
                setEndDate("")
                setSelectedTimes([])
                setShowPrice("")
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.error("Submission error:", error);
            toast.error('An error occurred. Please try again.')
        }
        setAddingShow(false)
    }

    useEffect(() => {
        if (user) {
            fetchMovies();
        }
    }, [user]);

    return nowPlayingMovies.length > 0 ? (
        <>
            <Title text1="Add" text2="Shows" />

            <div className="flex gap-4 mt-10 mb-6">
                <button
                    className={`px-4 py-2 rounded bg-primary text-white`}
                >
                    Now Playing
                </button>
            </div>

            <p className="text-lg font-medium">Choose Movie</p>
            <div className="overflow-x-auto pb-4">
                <div className="group flex flex-wrap gap-4 mt-4 w-max">
                    {nowPlayingMovies.map((movie) => (
                        <div key={movie.id} className={`relative max-w-40 cursor-pointer group-hover:not-hover:opacity-40 hover:-translate-y-1 transition duration-300 `} onClick={() => setSelectedMovie(movie.id)}>
                            <div className="relative rounded-lg overflow-hidden">
                                <img src={image_base_url + movie.poster_path} alt="" className="w-full object-cover brightness-90" />
                                <div className="text-sm flex items-center justify-between p-2 bg-black/70 w-full absolute bottom-0 left-0">
                                    <p className="flex items-center gap-1 text-gray-400">
                                        <StarIcon className="w-4 h-4 text-primary fill-primary" />
                                        {movie.vote_average.toFixed(1)}
                                    </p>
                                    <p className="text-gray-300">{kConverter(movie.vote_count)} Votes</p>
                                </div>
                            </div>
                            {selectedMovie === movie.id && (
                                <div className="absolute top-2 right-2 flex items-center justify-center bg-primary h-6 w-6 rounded">
                                    <CheckIcon className="w-4 h-4 text-white" strokeWidth={2.5} />
                                </div>
                            )}
                            <p className="font-medium truncate">{movie.title}</p>
                            <p className="text-gray-400 text-sm">{movie.release_date}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Show Price Input */}
            <div className="mt-8">
                <label className="block text-sm font-medium mb-2">Show Price</label>
                <div className="inline-flex items-center gap-2 border border-gray-600 px-3 py-2 rounded-md">
                    <p className="text-gray-400 text-sm">{currency}</p>
                    <input min={0} type="number" value={showPrice} onChange={(e) => setShowPrice(e.target.value)} placeholder="Enter show price" className="outline-none" />
                </div>
            </div>

            {/* Date & Time Selection */}
            <div className="mt-6">
                <label className="block text-sm font-medium mb-2">Select Date Range and Time</label>
                <div className="flex flex-wrap gap-4 mb-4">
                    <div className="flex flex-col">
                        <label className="text-xs text-gray-400 mb-1">Start Date</label>
                        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="bg-gray-800 border border-gray-600 p-2 rounded-md outline-none" />
                    </div>
                    <div className="flex flex-col">
                        <label className="text-xs text-gray-400 mb-1">End Date</label>
                        <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="bg-gray-800 border border-gray-600 p-2 rounded-md outline-none" />
                    </div>
                </div>

                <div className="inline-flex gap-5 border border-gray-600 p-1 pl-3 rounded-lg">
                    <input type="time" value={timeInput} onChange={(e) => setTimeInput(e.target.value)} className="outline-none rounded-md bg-transparent" />
                    <button onClick={handleTimeAdd} className="bg-primary/80 text-white px-3 py-2 text-sm rounded-lg hover:bg-primary cursor-pointer" >
                        Add Time
                    </button>
                </div>
            </div>

            {/* Display Selected Times */}
            {selectedTimes.length > 0 && (
                <div className="mt-6">
                    <h2 className=" mb-2">Selected Times</h2>
                    <div className="flex flex-wrap gap-2 mt-1 text-sm">
                        {selectedTimes.map((time) => (
                            <div key={time} className="border border-primary px-2 py-1 flex items-center rounded" >
                                <span>{time}</span>
                                <DeleteIcon onClick={() => handleRemoveTime(time)} width={15} className="ml-2 text-red-500 hover:text-red-700 cursor-pointer" />
                            </div>
                        ))}
                    </div>
                </div>
            )}
            <button onClick={handleSubmit} disabled={addingShow} className="bg-primary text-white px-8 py-2 mt-6 rounded hover:bg-primary/90 transition-all cursor-pointer" >
                Add Show
            </button>
        </>
    ) : <Loading />
}

export default AddShows
