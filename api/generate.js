export default async function handler(req, res) {

try {

const response = await fetch("https://api.openai.com/v1/chat/completions", {

method: "POST",

headers: {
"Content-Type": "application/json",
"Authorization": "Bearer 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"
},

body: JSON.stringify({
model: "gpt-4o-mini",
messages: [
{
role: "user",
content: `Write a short viral TikTok script about ${req.body.topic}. Include a hook, script, caption, and hashtags.`
}
]
})

})

const data = await response.json()

res.status(200).json({
text: data.choices[0].message.content
})

}

catch(error){

res.status(500).json({
text: "Error generating script"
})

}

}
