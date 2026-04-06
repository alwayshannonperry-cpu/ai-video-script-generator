import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  try {
    const chunks = [];

    for await (const chunk of req) {
      chunks.push(chunk);
    }

    const buf = Buffer.concat(chunks);

    const sig = req.headers["stripe-signature"];

    const event = stripe.webhooks.constructEvent(
      buf,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const email = session.customer_details?.email;

      console.log("PAYMENT SUCCESS:", email);
    }

    res.status(200).json({ received: true });

  } catch (err) {
    console.error("WEBHOOK ERROR:", err.message);
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
}
