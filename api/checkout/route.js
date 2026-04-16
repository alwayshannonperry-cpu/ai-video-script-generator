import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  const body = await req.json();
  const { prompt } = body;

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",

    customer_creation: "always",

    line_items: [
      {
        price: "YOUR_PRICE_ID_HERE",
        quantity: 1,
      },
    ],

    success_url: "https://ai-video-script-generator-beta.vercel.app",
    cancel_url: "https://ai-video-script-generator-beta.vercel.app",

    metadata: {
      prompt,
    },
  });

  return new Response(JSON.stringify({ url: session.url }), {
    status: 200,
  });
}
