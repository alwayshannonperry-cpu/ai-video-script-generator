import { paidUsers } from "@/lib/store";

export async function POST(req) {
  const body = await req.json();

  console.log("Webhook event:", body.type);

  if (body.type === "checkout.session.completed") {
    const session = body.data.object;

    const email = session.customer_details?.email;

    console.log("💰 Payment successful for:", email);

    if (email) {
      paidUsers.add(email);
      console.log("✅ User marked as paid:", email);
    }
  }

  return new Response(JSON.stringify({ received: true }), {
    status: 200,
  });
}
