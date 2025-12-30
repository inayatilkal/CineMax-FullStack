import React, { useEffect, useState } from 'react'
import { dummyBookingData } from '../../assets/assets';
import Loading from '../../components/Loading';
import Title from '../../components/admin/Title';
import { dateFormat } from '../../lib/dateFormat';
import { currencyFormat } from '../../lib/currencyFormat';
import { useAppContext } from '../../context/AppContext';

const ListBookings = () => {
  const { axios, getToken, user } = useAppContext()

  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const getAllBookings = async () => {
    try {
      const { data } = await axios.get("/api/admin/all-bookings", {
        headers: { Authorization: `Bearer ${await getToken()}` }
      });
      setBookings(data.bookings)
    } catch (error) {
      console.error(error);
    }
    setIsLoading(false)
  };

  useEffect(() => {
    if (user) {
      getAllBookings();
    }
  }, [user]);


  return !isLoading ? (
    <>
      <Title text1="List" text2="Bookings" />
      <div className="max-w-4xl mt-6 overflow-x-auto">
        <table className="w-full border-collapse  rounded-md overflow-hidden text-nowrap">
          <thead>
            <tr className="bg-primary/20 text-left text-white">
              <th className="p-2 font-medium pl-5">User Name</th>
              <th className="p-2 font-medium">Movie Name</th>
              <th className="p-2 font-medium">Show Time</th>
              <th className="p-2 font-medium">Seats</th>
              <th className="p-2 font-medium">Amount</th>
            </tr>
          </thead>
          <tbody className="text-sm font-light">
            {bookings.map((item, index) => {
              const userName = item?.user?.name || 'Unknown User';
              const movieTitle = item?.show?.movie?.title || 'Unknown Movie';
              const showTime = item?.show?.showDateTime ? dateFormat(item.show.showDateTime) : 'N/A';

              // bookedSeats may be an array or object; handle both
              let seats = '';
              if (Array.isArray(item?.bookedSeats)) {
                seats = item.bookedSeats.join(', ');
              } else if (item?.bookedSeats && typeof item.bookedSeats === 'object') {
                seats = Object.values(item.bookedSeats).join(', ');
              } else {
                seats = 'N/A';
              }

              return (
                <tr key={index} className="border-b border-primary/20 bg-primary/5 even:bg-primary/10">
                  <td className="p-2 min-w-45 pl-5">{userName}</td>
                  <td className="p-2">{movieTitle}</td>
                  <td className="p-2">{showTime}</td>
                  <td className="p-2">{seats}</td>
                  <td className="p-2">{currencyFormat(item?.amount ?? 0)}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </>
  ) : <Loading />
}

export default ListBookings
