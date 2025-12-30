import { StarIcon } from 'lucide-react'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import timeFormat from '../lib/timeFormat'
import { useAppContext } from '../context/AppContext'
import { Heart } from 'lucide-react'
import toast from 'react-hot-toast'

const MovieCard = ({ movie }) => {

  const navigate = useNavigate()
  const { image_base_url, axios, getToken, user, fetchFavoriteMovies, favoriteMovies } = useAppContext()

  const isFavorite = favoriteMovies?.some(f => f._id === movie._id)

  const handleFavorite = async () => {
    try {
      if (!user) return toast.error('Please login to proceed')

      const { data } = await axios.post('/api/user/update-favorite', { movieId: movie._id }, {
        headers: { Authorization: `Bearer ${await getToken()}` }
      })

      if (data.success) {
        await fetchFavoriteMovies()
        toast.success(data.message)
        // Redirect only when adding a favorite
        if (!isFavorite) {
          navigate('/favorite')
        }
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.error(error)
      toast.error(error.message || 'Something went wrong')
    }
  }

  return (
    <div className='flex flex-col justify-between p-3 bg-gray-800 rounded-2xl hover:-translate-y-1 transition duration-300 w-66'>

      <img onClick={() => { navigate(`/movies/${movie._id}`); scrollTo(0, 0) }}
        src={image_base_url + movie.backdrop_path} alt="" className='rounded-lg h-52 w-full object-cover object-right-bottom cursor-pointer' />

      <p className='font-semibold mt-2 truncate'>{movie.title}</p>

      <p className='text-sm text-gray-400 mt-2'>
        {new Date(movie.release_date).getFullYear()} • {movie.genres.slice(0, 2).map(genre => genre.name).join(" | ")} • {timeFormat(movie.runtime)}
      </p>

      <div className='flex items-center justify-between mt-4 pb-3'>
        <div className="flex items-center gap-2">
          <button onClick={() => { navigate(`/movies/${movie._id}`); scrollTo(0, 0) }} className='px-4 py-2 text-xs bg-primary hover:bg-primary-dull transition rounded-full font-medium cursor-pointer'>Buy Tickets</button>
          <button onClick={handleFavorite} className='px-3 py-2 text-xs bg-gray-700 hover:bg-gray-600 transition rounded-full font-medium flex items-center gap-2'>
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-primary text-primary' : ''}`} />
            {isFavorite ? 'Remove from Favorite' : 'Add to Favorite'}
          </button>
        </div>

        <p className='flex items-center gap-1 text-sm text-gray-400 mt-1 pr-1'>
          <StarIcon className="w-4 h-4 text-primary fill-primary" />
          {movie.vote_average.toFixed(1)}
        </p>
      </div>

    </div>
  )
}

export default MovieCard
