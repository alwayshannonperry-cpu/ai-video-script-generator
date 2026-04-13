import { paidUsers } from "@/lib/store";

export async function POST(req) {
  try {
    const body = await req.json();

    if (body.type === "checkout.session.completed") {
      const session = body.data.object;

      const email = session.customer_details?.email;

      console.log("💰 Payment success from:", email);

      if (email) {
        paidUsers.add(email);
        console.log("✅ User saved as paid:", email);
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
    });

  } catch (err) {
    console.error("Webhook error:", err);

    return new Response(JSON.stringify({ error: "Webhook failed" }), {
      status: 400,
    });
  }
}
