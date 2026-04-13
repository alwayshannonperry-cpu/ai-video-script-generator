import OpenAI from "openai";
import { paidUsers } from "@/lib/store";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    const body = await req.json();
    const prompt = body.prompt;
    const email = body.email;

    console.log("Generate request from:", email);

    // 🚫 Block if not paid
    if (!paidUsers.has(email)) {
      return new Response(
        JSON.stringify({ error: "User has not paid" }),
        { status: 403 }
      );
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const result = completion.choices[0].message.content;

    return new Response(JSON.stringify({ result }), {
      status: 200,
    });

  } catch (error) {
    console.error("Generate API error:", error);

    return new Response(
      JSON.stringify({ error: "Something went wrong" }),
      { status: 500 }
    );
  }
}
