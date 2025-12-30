import mongoose from "mongoose";

const theatreSchema = new mongoose.Schema({
    name: { type: String, required: true },
    address: { type: String },
    city: { type: String },
    // coordinates stored as { lat, lng }
    coords: {
        lat: { type: Number },
        lng: { type: Number }
    }
}, { timestamps: true });

const Theatre = null;

export default Theatre;
