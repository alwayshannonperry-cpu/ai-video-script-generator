import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// simple in-memory daily limit tracking
let requests = {}

export default async function handler(req,res){
  if(req.method!=="POST") return res.status(405).json({text:"Method not allowed"})

  const ip = req.headers["x-forwarded-for"] || req.socket?.remoteAddress || "unknown"
  const now = Date.now()
  if(!requests[ip]) requests[ip]={count:0,time:now}
  if(now - requests[ip].time > 86400000) requests[ip]={count:0,time:now}

  if(requests[ip].count>=20){
    return res.status(429).json({text:"Free daily limit reached. Upgrade for unlimited."})
  }
  requests[ip].count++

  const {topic, style, email} = req.body
  if(!topic || !email) return res.status(400).json({text:"Topic and email required"})

  try{
    const prompt = `Write a short ${style} video script for "${topic}". Include title, hook, script, caption, hashtags.`

    const completion = await openai.chat.completions.create({
      model:"gpt-3.5-turbo",
      messages:[{role:"user", content:prompt}],
      max_tokens:300
    })

    const text = completion.choices[0].message.content
    res.status(200).json({text})
  }catch(err){
    console.error(err)
    res.status(500).json({text:"Error generating script"})
  }
}
