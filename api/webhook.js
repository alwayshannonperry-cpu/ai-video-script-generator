import { paidUsers } from "@/lib/store";

export async function POST(req) {
  try {
    const body = await req.json();

    if (body.type === "checkout.session.completed") {
      const session = body.data.object;

      const email = session.customer_details?.email;

      if (email) {
        paidUsers.add(email);
        console.log("Paid user:", email);
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
    });

  } catch (err) {
    console.error(err);

    return new Response(
      JSON.stringify({ error: "Webhook error" }),
      { status: 400 }
    );
  }
}
