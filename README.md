
*CineMax* is a full-stack movie ticket booking platform developed using the *MERN stack* (MongoDB, Express, React, Node.js). It includes a complete user and admin experience, secure payment integration, and an AI-powered chatbot for movie recommendations.

🔗 Live Demo
[Click here to view the live site](https://cinemax-client-two.vercel.app)  
⚠️ *For the best experience, use a laptop or PC.*

---

👥 Team Members
- *Inayat Ilkal* 
- *Chetan Devalatkar*

---

💡 Features

👤 User Side
- Registration/Login
- Home Page with movie listings
- Movie Details Page
- Seat Booking with double-booking prevention
- Favourites Page
- My Bookings Page
- Payment Gateway Integration using *Stripe*
  - Use test card: `4242 4242 4242 4242`
- AI Chatbot (*CineBot*) to recommend movies based on genre, rating, or name (powered by *Gemini API*)

🛠️ Admin Side
- Admin Dashboard with:
  - Active user tracking
  - Total bookings and revenue
  - Show/movie addition
  - Booking management

---

🧠 Tech Stack

- *Frontend:* React, Tailwind CSS
- - *Backend:* Node.js, Express
- *Database:* MongoDB
- *Payment Integration:* Stripe
- *AI Integration:* Gemini API (limited to 1500 requests)
- *Authentication:* JWT
- *State Management:* Context API / Redux (if used)

---

📁 Pages Structure (9 Total)

1. Home Page  
2. Movie Details Page  
3. Seat Booking Page  
4. Favourites Page  
5. My Bookings Page  
6. Payment Page  
7. Admin Dashboard  
8. Registration/Login Page  
9. Movie List Page

---

🚀 Installation (For Local Setup)

1. *Clone the repo:*
   ```bash
   git clone https://github.com/inayatilkal/CineMax-FullStack.git
   ```

2. *Install client dependencies:*
   ```bash
   cd client
   npm install
   ```

3. *Install server dependencies:*
   ```bash
   cd ../server
   npm install
   ```

4. *Setup `.env` files in server folders* with:
   Open Project Folder In VS Code
   -Setup The MongoDB & obtain MongoURI,
   ```bash
   Link : https://www.mongodb.com/cloud/atlas/register
   ```
   . Add mongoDB URI in “ .env ” file of server folder
   -Setup TMDB,
   ```bash
    Link : https://www.themoviedb.org
   ```
   -Setup Brevo ( For Email Feature ),
   ```bash
    Link : https://www.brevo.com
   ```
   -Setup Inngest Keys (add both event key and signin key in .env),
   ```bash
   Link : https://www.inngest.com
   ```
   -Setup Clerk (add both clerk publishable key and secret key in .env and also add clerk publishable key in client folder .env file),
   ```bash
   Link : https://clerk.com
   ```
   -Setup Clerk Webhooks,
   ```bash
   Link : https://dashboard.clerk.com
   ```
   -Sync App On Inngest,
   ```bash
   Link : https://www.inngest.com
   ```
   -Set Admin :
   ```bash
    set admin role in clerk private metadata, “role”:”admin”
   ```
   -Setup Stripe,
   ```bash
    Link : https://dashboard.stripe.com/register
   ```
   -setup Gemini free API,
   ```bash
   Link : https://aistudio.google.com/app/api-keys
   ```

6. *setup `.env` files in client folders* with:
   Open project folder in VS Code
   -Copy the clerk publishable key from server folder in .env file and paste it in client folder in .env file


7. *Run inngest in server folder:*
   ```bash
   npm run inngest
   ```

8. *Run backend:*
   ```bash
   npm run server
   ```

9. *Run frontend:*
   ```bash
   npm run dev
   ```

---

📌 Note

- The *CineBot* AI chatbot uses Gemini API and is limited to *1500 free requests*
- The Stripe gateway is in test mode; use test cards only

---

📧 Feedback

We’d love your feedback, suggestions, or contributions.  
Feel free to open issues or pull requests.

---

📝 License

This project is for educational/demo purposes.

```
