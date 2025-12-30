import 'dotenv/config';
import connectDB from './configs/db.js';
import Booking from './models/Booking.js';

async function markAllPaid() {
    await connectDB();

    const result = await Booking.updateMany(
        { isPaid: false },
        { $set: { isPaid: true, paymentLink: "" } }
    );

    console.log(`Updated ${result.modifiedCount} bookings to 'Paid'.`);
    process.exit();
}

markAllPaid();
