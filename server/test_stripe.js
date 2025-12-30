import stripe from 'stripe';
import 'dotenv/config';

const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);

async function testStripe() {
    try {
        const session = await stripeInstance.checkout.sessions.create({
            success_url: 'http://localhost:3000/success',
            cancel_url: 'http://localhost:3000/cancel',
            line_items: [{
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: 'Test Movie'
                    },
                    unit_amount: 1000
                },
                quantity: 1
            }],
            mode: 'payment',
        });
        console.log("Session created:", session.id);
    } catch (error) {
        console.error("Stripe Error:", error.message);
    }
}

testStripe();
