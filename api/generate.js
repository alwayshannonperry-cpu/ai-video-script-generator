import OpenAI from "openai";
import { paidUsers } from "../../../lib/store";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    const body = await req.json();
    const { prompt, email } = body;

    if (!paidUsers.has(email)) {
      return new Response(
        JSON.stringify({ error: "Please complete payment first" }),
        { status: 403 }
      );
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    });

    const result = completion.choices[0].message.content;

    return new Response(JSON.stringify({ result }), {
      status: 200,
    });

  } catch (err) {
    console.error(err);
    return new Response(
      JSON.stringify({ error: "Generation failed" }),
      { status: 500 }
    );
  }
}
