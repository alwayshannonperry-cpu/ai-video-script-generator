export default async function handler(req,res){

const response = await fetch("https://api.openai.com/v1/chat/completions",{

method:"POST",

headers:{
"Content-Type":"application/json",
"Authorization":"Bearer YOUR_API_KEY"
},

body:JSON.stringify({

model:"gpt-4o-mini",

messages:[{
role:"user",
content:`Create a 30 second viral TikTok script about ${req.body.topic}. Include hook, script, and hashtags`
}]

})

})

const data = await response.json()

res.status(200).json({text:data.choices[0].message.content})

}