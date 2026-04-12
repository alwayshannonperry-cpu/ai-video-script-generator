import OpenAI from "openai";
import { paidUsers } from "@/lib/store";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  const body = await req.json();
  const { prompt, email } = body;

  console.log("Generate request from:", email);

  // 🚫 BLOCK if not paid
  if (!paidUsers.has(email)) {
    return new Response(
      JSON.stringify({ error: "User has not paid" }),
      { status: 403 }
    );
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "user", content: prompt }
      ],
    });

    const result = completion.choices[0].message.content;

    return new Response(JSON.stringify({ result }), {
      status: 200,
    });

  } catch (err) {
    console.error("OpenAI error:", err);

    return new Response(
      JSON.stringify({ error: "Generation failed" }),
      { status: 500 }
    );
  }
}
