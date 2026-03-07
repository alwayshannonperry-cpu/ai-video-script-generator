export default async function handler(req, res) {

const response = await fetch("https://api.openai.com/v1/chat/completions", {

method: "POST",

headers: {
"Content-Type": "application/json",
"Authorization": "Bearer YOUR_OPENAI_KEY"
},

body: JSON.stringify({
model: "gpt-4o-mini",
messages: [{
role: "user",
content: `Write a short viral TikTok script about ${req.body.topic}. Include a hook, the script, and hashtags.`
}]
})

})

const data = await response.json()

res.status(200).json({
text: data.choices[0].message.content
})

}
