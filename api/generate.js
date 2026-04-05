import OpenAI from "openai";
import { isPro } from "./users";

const openai = new OpenAI({
apiKey: process.env.OPENAI_API_KEY
});

let requests = {};

export default async function handler(req,res){

if(req.method!=="POST"){
return res.status(405).json({text:"Method not allowed"})
}

const {email,topic} = req.body;

if(!email || !topic){
return res.status(400).json({text:"Missing info"})
}

const ip=req.headers["x-forwarded-for"]||"unknown";

if(!requests[ip]){
requests[ip]={count:0,time:Date.now()};
}

if(Date.now()-requests[ip].time>86400000){
requests[ip]={count:0,time:Date.now()};
}

// FREE LIMIT
if(!isPro(email) && requests[ip].count>=5){
return res.status(429).json({
text:"Free limit reached. Upgrade for viral scripts."
});
}

requests[ip].count++;

try{

// 🔥 PRO USERS
if(isPro(email)){

const completion = await openai.chat.completions.create({
model:"gpt-3.5-turbo",
messages:[{
role:"user",
content:`Write a highly engaging viral TikTok script about ${topic}. Include hook, script, caption, hashtags.`
}],
max_tokens:300
});

return res.status(200).json({
text:completion.choices[0].message.content
});
}

// 🧊 FREE USERS
const basic = `
HOOK:
Learn about ${topic}

SCRIPT:
Here are 3 simple points about ${topic}

CAPTION:
Quick tips on ${topic}

HASHTAGS:
#${topic.replace(/\s/g,"")}
`;

return res.status(200).json({text:basic});

}catch(e){
return res.status(500).json({text:"Error generating script"});
}

}
