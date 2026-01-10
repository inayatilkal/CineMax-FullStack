import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Loading from '../components/Loading'
import { ArrowRightIcon, ClockIcon } from 'lucide-react'
import isoTimeFormat from '../lib/isoTimeFormat'
import { currencyFormat } from '../lib/currencyFormat'
import BlurCircle from '../components/BlurCircle'
import toast from 'react-hot-toast'
import { useAppContext } from '../context/AppContext'

const SeatLayout = () => {
  const groupRows = [["A", "B"], ["C", "D"], ["E", "F"], ["G", "H"], ["I", "J"]]

  const { id, date } = useParams()
  const [selectedSeats, setSelectedSeats] = useState([])
  const [selectedTime, setSelectedTime] = useState(null)
  const [show, setShow] = useState(null)
  const [occupiedSeats, setOccupiedSeats] = useState([])

  const navigate = useNavigate()

  const { axios, getToken, user } = useAppContext();

  const getShow = async () => {
    try {
      const { data } = await axios.get(`/api/show/${id}`)
      if (data.success) {
        setShow(data)
        // auto-select first time for the provided date (if any)
        const times = data.dateTime?.[date] || []
        if (times.length > 0) {
          setSelectedTime(times[0])
        } else {
          setSelectedTime(null)
        }
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleSeatClick = (seatId) => {
    if (!selectedTime) {
      return toast("Please select time first")
    }
    if (!selectedSeats.includes(seatId) && selectedSeats.length > 4) {
      return toast("You can only select 5 seats")
    }
    if (occupiedSeats.includes(seatId)) {
      return toast('This seat is already booked')
    }
    setSelectedSeats(prev => prev.includes(seatId) ? prev.filter(seat => seat !== seatId) : [...prev, seatId])
  }

  const renderSeats = (row, count = 9) => (
    <div key={row} className="flex gap-2 mt-2">
      <div className="flex flex-wrap items-center justify-center gap-2">
        {Array.from({ length: count }, (_, i) => {
          const seatId = `${row}${i + 1}`;
          return (
            <button key={seatId} onClick={() => handleSeatClick(seatId)} className={`h-8 w-8 rounded border border-primary/60 cursor-pointer
                         ${selectedSeats.includes(seatId) && "bg-primary text-white"} 
                         ${occupiedSeats.includes(seatId) && "opacity-50"}`}>
              {seatId}
            </button>
          );
        })}
      </div>
    </div>
  )

  const getOccupiedSeats = async () => {
    try {
      if (!selectedTime) return setOccupiedSeats([])
      const { data } = await axios.get(`/api/booking/seats/${selectedTime.showId}`)
      if (data.success) {
        setOccupiedSeats(data.occupiedSeats)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const bookTickets = async () => {
    try {
      if (!user) return toast.error('Please login to proceed')

      if (!selectedTime || !selectedSeats.length) return toast.error('Please select a time and seats');

      const { data } = await axios.post('/api/booking/create', { showId: selectedTime.showId, selectedSeats }, { headers: { Authorization: `Bearer ${await getToken()}` } });

      if (data.success) {
        window.location.href = data.url;
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    getShow()
  }, [])

  useEffect(() => {
    if (selectedTime) {
      getOccupiedSeats()
      // clear selected seats when time changes
      setSelectedSeats([])
    } else {
      setOccupiedSeats([])
    }
  }, [selectedTime])

  return show ? (
    <div className='flex flex-col md:flex-row px-6 md:px-16 lg:px-40 py-30 md:pt-50'>
      {/* Available Timings */}
      <div className='w-72 bg-primary/10 border border-primary/20 rounded-lg py-4 h-max md:sticky md:top-30 px-3'>
        <p className='text-lg font-semibold px-1'>Available Timings</p>

        <div className='mt-4 space-y-2 px-1'>
          {(show.dateTime?.[date] && show.dateTime[date].length > 0) ? show.dateTime[date].map((item) => (
            <div key={item.showId} onClick={() => setSelectedTime(item)} className={`flex items-center gap-2 px-3 py-2 rounded cursor-pointer ${selectedTime?.showId === item.showId ? 'bg-primary text-white' : 'hover:bg-primary/20'}`}>
              <ClockIcon className="w-4 h-4" />
              <p className='text-sm'>{isoTimeFormat(item.time)}</p>
            </div>
          )) : <p className='text-sm text-gray-400 px-1'>No showtimes available for this date.</p>}
        </div>
      </div>
      {/* end Available Timings */}

      {/* Seats Layout */}
      <div className='relative flex-1 flex flex-col items-center max-md:mt-16'>
        <BlurCircle top="-100px" left="-100px" />
        <BlurCircle bottom="0" right="0" />
        <h1 className='text-2xl font-semibold mb-4'>Select your seat</h1>
        <img src={'/src/assets/screenImage.svg'} alt="screen" />
        <p className='text-gray-400 text-sm mb-6'>SCREEN SIDE</p>

        <div className='flex flex-col items-center mt-10 text-xs text-gray-300'>
          <div className='grid grid-cols-2 md:grid-cols-1 gap-8 md:gap-2 mb-6'>
            {groupRows[0].map(row => renderSeats(row))}
          </div>

          <div className='grid grid-cols-2 gap-11'>
            {groupRows.slice(1).map((group, idx) => (
              <div key={idx}>
                {group.map(row => renderSeats(row))}
              </div>
            ))}
          </div>
        </div>



        {selectedTime && selectedSeats.length > 0 && (
          <div className='flex flex-col items-center mt-6 mb-4 font-medium'>
            <p className='text-gray-300 text-sm'>
              {selectedSeats.length} Seat{selectedSeats.length > 1 ? 's' : ''} selected
            </p>
            <p className='text-xl text-white'>
              Total: {currencyFormat(selectedSeats.reduce((total, seat) => {
                let price = selectedTime.price;
                if (['C1', 'C2', 'D1', 'D2', 'E8', 'E9', 'F8', 'F9'].includes(seat)) {
                  price -= 0.33;
                } else if (['G1', 'G2', 'H1', 'H2', 'I8', 'I9', 'J8', 'J9'].includes(seat)) {
                  price -= 0.55;
                }
                return total + price;
              }, 0))}
            </p>
          </div>
        )}

        <button onClick={bookTickets} className='flex items-center gap-1 mt-2 px-10 py-3 text-sm bg-primary hover:bg-primary-dull transition rounded-full font-medium cursor-pointer active:scale-95'>
          Proceed to Checkout
          <ArrowRightIcon strokeWidth={3} className="w-4 h-4" />
        </button>


      </div>
    </div >
  ) : (
    <Loading />
  )
}

export default SeatLayout
