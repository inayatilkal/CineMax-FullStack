import { inngest } from "../inngest/index.js";
import Booking from "../models/Booking.js";
import Show from "../models/Show.js"
import stripe from 'stripe'


// Function to check availability of selected seats for a movie
const checkSeatsAvailability = async (showId, selectedSeats) => {
    try {
        const showData = await Show.findById(showId)
        if (!showData) return false;

        const occupiedSeats = showData.occupiedSeats;

        const isAnySeatTaken = selectedSeats.some(seat => occupiedSeats[seat]);

        return !isAnySeatTaken;
    } catch (error) {
        console.log(error.message);
        return false;
    }
}

export const createBooking = async (req, res) => {
    try {
        const { userId } = req.auth();
        const { showId, selectedSeats } = req.body;
        const { origin } = req.headers;

        // Check if the seat is available for the selected show
        const isAvailable = await checkSeatsAvailability(showId, selectedSeats)

        if (!isAvailable) {
            return res.json({ success: false, message: "Selected Seats are not available." })
        }

        // Get the show details
        const showData = await Show.findById(showId).populate('movie');

        // Create a new booking
        const booking = await Booking.create({
            user: userId,
            show: showId,
            amount: selectedSeats.reduce((total, seat) => {
                let price = showData.showPrice;
                if (['C1', 'C2', 'D1', 'D2', 'E8', 'E9', 'F8', 'F9'].includes(seat)) {
                    price -= 0.33;
                } else if (['G1', 'G2', 'H1', 'H2', 'I8', 'I9', 'J8', 'J9'].includes(seat)) {
                    price -= 0.55;
                }
                return total + price;
            }, 0),
            bookedSeats: selectedSeats
        })

        selectedSeats.map((seat) => {
            showData.occupiedSeats[seat] = userId;
        })

        showData.markModified('occupiedSeats');

        await showData.save();

        // Stripe Gateway Initialize
        const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY)

        // Creating line items to for Stripe
        const line_items = [{
            price_data: {
                currency: 'usd',
                product_data: {
                    name: showData.movie.title
                },
                unit_amount: Math.floor(booking.amount) * 100
            },
            quantity: 1
        }]

        const session = await stripeInstance.checkout.sessions.create({
            success_url: `${origin}/loading/my-bookings`,
            cancel_url: `${origin}/my-bookings`,
            line_items: line_items,
            mode: 'payment',
            metadata: {
                bookingId: booking._id.toString()
            },
            expires_at: Math.floor(Date.now() / 1000) + 30 * 60, // Expires in 30 minutes
        })

        booking.paymentLink = session.url
        booking.paymentSessionId = session.id
        await booking.save()

        // Run Inngest Sheduler Function to check payment status after 10 minutes
        await inngest.send({
            name: "app/checkpayment",
            data: {
                bookingId: booking._id.toString()
            }
        })

        res.json({ success: true, url: session.url })

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message })
    }
}

export const getOccupiedSeats = async (req, res) => {
    try {

        const { showId } = req.params;
        const showData = await Show.findById(showId)

        const occupiedSeats = Object.keys(showData.occupiedSeats)

        res.json({ success: true, occupiedSeats })

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message })
    }
}
