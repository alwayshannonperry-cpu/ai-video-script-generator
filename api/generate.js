export default async function handler(req, res) {

try {

const { topic } = req.body || {}

if (!topic) {
return res.status(400).json({ text: "Enter a topic first" })
}

const response = await fetch("https://api.openai.com/v1/chat/completions", {

method: "POST",

headers: {
"Content-Type": "application/json",
"Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
},

body: JSON.stringify({
model: "gpt-4o-mini",
messages: [
{
role: "user",
content: `Write a short viral TikTok script about ${topic}. Include a hook, script, caption, and hashtags.`
}
]
})

})

const data = await response.json()

res.status(200).json({
text: data.choices?.[0]?.message?.content || "No response"
})

}

catch(error){

res.status(500).json({
text: "Server error"
})

}

}
