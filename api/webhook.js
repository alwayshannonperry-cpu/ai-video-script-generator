import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// TEMP storage (we will upgrade later)
let proUsers = [];

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {

let buf = await new Promise(resolve => {
let data = [];
req.on("data", chunk => data.push(chunk));
req.on("end", () => resolve(Buffer.concat(data)));
});

const sig = req.headers["stripe-signature"];

let event;

try {
event = stripe.webhooks.constructEvent(
buf,
sig,
process.env.STRIPE_WEBHOOK_SECRET
);
} catch (err) {
console.error("Webhook signature error:", err.message);
return res.status(400).send(`Webhook Error: ${err.message}`);
}

if (event.type === "checkout.session.completed") {

const session = event.data.object;

const email = session.customer_details?.email;

console.log("EMAIL RECEIVED:", email);

// store temporarily
proUsers.push(email);

console.log("PRO USER ADDED:", email);
}

res.status(200).json({ received: true });
}
