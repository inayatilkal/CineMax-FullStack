import 'dotenv/config';
import connectDB from './configs/db.js';
import Booking from './models/Booking.js';
import User from './models/User.js';

async function checkBookings() {
    await connectDB();

    console.log("Fetching all bookings...");
    const bookings = await Booking.find({});
    console.log(`Found ${bookings.length} bookings.`);

    for (const booking of bookings) {
        const user = await User.findById(booking.user);
        if (!user) {
            console.log(`[MISSING] Booking ${booking._id} references User ${booking.user} (NOT FOUND in DB)`);
        } else {
            console.log(`[OK] Booking ${booking._id} references User ${user.name}`);
        }
    }
    process.exit();
}

checkBookings();
