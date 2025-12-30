import 'dotenv/config';
import connectDB from './configs/db.js';
import Booking from './models/Booking.js';

async function checkPendingBookings() {
    await connectDB();

    const pendingBookings = await Booking.find({ isPaid: false }).sort({ createdAt: -1 });

    console.log(`Found ${pendingBookings.length} pending (unpaid) bookings:`);

    pendingBookings.forEach(b => {
        console.log(`- ID: ${b._id} | Movie: ${b.show} | Amount: ${b.amount} | Created: ${b.createdAt}`);
    });

    process.exit();
}

checkPendingBookings();
