import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

let proUsers = [];

export default async function handler(req, res) {

const sig = req.headers["stripe-signature"];

let event;

try {
event = stripe.webhooks.constructEvent(
req.body,
sig,
process.env.STRIPE_WEBHOOK_SECRET
);
} catch (err) {
return res.status(400).send(`Webhook Error: ${err.message}`);
}

// ✅ WHEN PAYMENT SUCCEEDS
if (event.type === "checkout.session.completed") {

const session = event.data.object;

// 👇 this grabs customer email
const email = session.customer_details.email;

// add to pro users
proUsers.push(email);

console.log("NEW PRO USER:", email);
}

res.status(200).json({ received: true });
}
