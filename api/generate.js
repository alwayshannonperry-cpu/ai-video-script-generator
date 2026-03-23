import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// in‑memory daily usage tracking
let requests = {}

// manually maintained pro user list
const proUsers = ["yourpaidemail@example.com"]; 

export default async function handler(req,res){
  if(req.method!=="POST") return res.status(405).json({ text:"Method not allowed" });

  const ip = req.headers["x-forwarded-for"] || req.socket?.remoteAddress || "unknown";
  const now = Date.now();

  if(!requests[ip]) requests[ip]={count:0,time:now};
  if(now - requests[ip].time > 86400000) requests[ip]={count:0,time:now};

  const { topic, style, email } = req.body;
  if(!topic || !email) return res.status(400).json({text:"Topic and email required."});

  // free daily limit
  if(!proUsers.includes(email) && requests[ip].count>=20){
    return res.status(429).json({ text:"Free daily limit reached. Upgrade for unlimited viral scripts." });
  }
  requests[ip].count++;

  try{
    // if user paid
    if(proUsers.includes(email)){
      const prompt = `Create a viral short‑form video script optimized for engagement on TikTok, Reels, and Shorts for topic: "${topic}". Include:
      - Eye‑catching hook
      - 3‑step story or message
      - Strong call‑to‑action
      - Viral‑style caption and hashtags
      Use persuasive language, curiosity triggers, and engagement psychology.`;

      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role:"user", content: prompt }],
        max_tokens: 350
      });

      const text = completion.choices[0].message.content;
      return res.status(200).json({ text });
    }

    // FREE GENERIC SCRIPT
    const genericScript = `
Generic Script for "${topic}"

HOOK:
Learn something new about ${topic}.

SCRIPT:
Here are three points about ${topic}:
1. ...
2. ...
3. ...

CAPTION:
Learn more about ${topic}.

HASHTAGS:
#${topic.replace(/\s/g,"")} #shorts
`;

    return res.status(200).json({ text:genericScript });

  } catch(err){
    console.error(err);
    return res.status(500).json({ text:"Error generating script." });
  }
}
