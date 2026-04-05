import Stripe from "stripe";
import { addUser } from "./users";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const config = {
api: {
bodyParser: false,
},
};

export default async function handler(req, res){

const sig = req.headers["stripe-signature"];

let buf = await new Promise(resolve => {
let data = [];
req.on("data", chunk => data.push(chunk));
req.on("end", () => resolve(Buffer.concat(data)));
});

let event;

try {
event = stripe.webhooks.constructEvent(
buf,
sig,
process.env.STRIPE_WEBHOOK_SECRET
);
} catch (err) {
return res.status(400).send(`Webhook Error: ${err.message}`);
}

// ✅ WHEN PAYMENT SUCCEEDS
if(event.type === "checkout.session.completed"){

const session = event.data.object;

const email = session.customer_details.email;

addUser(email);

console.log("PRO USER ADDED:", email);
}

res.status(200).json({received:true});
}
