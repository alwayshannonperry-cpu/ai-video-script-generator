import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  try {
    let buf = await new Promise((resolve) => {
      let data = [];
      req.on("data", (chunk) => data.push(chunk));
      req.on("end", () => resolve(Buffer.concat(data)));
    });

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
