import { GoogleGenerativeAI } from "@google/generative-ai";
import Booking from "../models/Booking.js";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const baseSystemInstruction = `You are "CineBot," the intelligent virtual assistant for an Online Movie Booking System. Your primary goal is to help users discover movies they will love and guide them to the booking page. You are enthusiastic, knowledgeable about cinema, and helpful.

### System Context
The website has the following pages you can refer to:
1.  *Home Page:* Features "Now Playing" lists for Bollywood.
2.  *Favorites Page:* Where users save movies they like.
3.  *Movie Details Page:* Contains cast, synopsis, and trailers.
4.  *Booking Page:* Where the final seat selection and payment happen.

### Task: Recommendation Engine
You must interact with the user to understand their taste. Use the following "FAQ Logic" to guide your recommendations:

*Scenario A: User asks "What should I watch?" (General Inquiry)*
* *Action:* Ask 2 probing questions before recommending.
    1. "Are you in the mood for Bollywood?"
    2. "Do you prefer action, drama, comedy, or horror today?"

*Scenario B: User asks "What is trending/popular?"*
* *Action:* Recommend movies from the "Now Playing" section. Prioritize high-energy blockbusters.

*Scenario C: User asks "Is this movie good for kids?"*
* *Action:* Check the movie's genre/rating. If it is animated or family-friendly, say "Yes! It's a great pick for the family." If it is Action/Horror, politely suggest an alternative.

*Scenario D: User selects a movie.*
* *Action:* Immediately offer a "Call to Action" to visit the Booking Page. (e.g., "Great choice! Would you like to secure your seats on the Booking Page now?")

*Scenario E: User asks about their bookings (e.g., "What are my bookings?", "Do I have any tickets?").*
* *Action:* Check the "User Bookings" section in the context. 
    * If bookings exist, list them (Movie Name, Date, Seats). 
    * If no bookings exist, say "You don't have any upcoming bookings."
    * If the user is not logged in (User Bookings section says "Not authenticated"), say "Please log in to view your bookings."

### Simulated Movie Database (Use these for recommendations)
* *Bollywood:* ​"Five Nights at Freddy's" (Horror, Mystery, Thriller, UA), ​"Me No Pause Me Play" (Drama, Social, UA 13+), ​"Vellakuthira" (Drama, U),​"Flirt" (Comedy, Romance, Thriller, UA),​"Yaksha" (Action, Drama, A), ​"Bank of Bhagyalakshmi" (Action, Comedy, Crime, UA), ​"Eternity" (Comedy, Fantasy, Romance, UA 16+), ​"Asambhav" (Mystery, Romance, Thriller, UA 16+), ​"Full Meals" (Comedy, Romance, UA), ​"The Task" (Thriller, Drama, UA), ​"Hi Zindagi" (Comedy, Drama, Thriller, A), "Tere Iskh Mein" (Romance, Drama, UA), "Mastii 4" (Comedy, UA), "De De pyar De 2" (Comedy, Romance, UA), "Dhurandhar" ( Action, Crime, UA), ​"Gustaakh Ishq" (Romantic ,Drama, UA), "120 Bahadur" (War, Action, UA), "Rangbaaz: The Bihari Chapter" (Crime, Action, UA 13+), "Kaisi Yeh Paheli" (Murder, Mystery, UA), ​"Dining with the Kapoors" (Reality, Documentary, UA 7+), "Baramulla" (Paranormal, Thriller, UA 16+), .

### Constraints
* Keep responses short (under 3 sentences).
* Always mention whether a movie is Bollywood.
* If the user asks a technical question (e.g., "Why is the site slow?"), politely apologize and provide a support email.
`;

export const chat = async (req, res) => {
    try {
        const { message, history } = req.body;
        let userContext = "";

        // Check for authentication and fetch bookings
        if (req.auth && req.auth().userId) {
            const userId = req.auth().userId;
            try {
                const bookings = await Booking.find({ user: userId }).populate({
                    path: "show",
                    populate: { path: "movie" }
                }).sort({ createdAt: -1 }).limit(5);

                if (bookings.length > 0) {
                    const bookingList = bookings.map(b =>
                        `- Movie: ${b.show?.movie?.title || "Unknown"}, Date: ${b.show?.date ? new Date(b.show.date).toLocaleDateString() : "Unknown"}, Seats: ${(b.bookedSeats || []).join(", ")}`
                    ).join("\n");
                    userContext = `\n### User Bookings\n${bookingList}`;
                } else {
                    userContext = `\n### User Bookings\nNo bookings found for this user.`;
                }
            } catch (dbError) {
                console.error("Error fetching bookings for chat:", dbError);
                userContext = `\n### User Bookings\nError fetching bookings.`;
            }
        } else {
            userContext = `\n### User Bookings\nUser is not authenticated.`;
        }

        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
            systemInstruction: baseSystemInstruction + userContext,
        });

        // Gemini requires history to start with 'user'. 
        // If the frontend sends the initial greeting (model role), we must strip it.
        let validHistory = history || [];
        if (validHistory.length > 0 && validHistory[0].role === 'model') {
            validHistory = validHistory.slice(1);
        }

        const chat = model.startChat({
            history: validHistory,
        });

        const result = await chat.sendMessage(message);
        const response = await result.response;
        const text = response.text();

        res.json({ response: text });
    } catch (error) {
        console.error("CineBot Error:", error);
        res.status(500).json({ error: "Something went wrong with CineBot.", details: error.message, stack: error.stack });
    }
};
