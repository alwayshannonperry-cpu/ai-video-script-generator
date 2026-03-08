export default async function handler(req, res) {

const response = await fetch("https://api.openai.com/v1/chat/completions", {

method: "POST",

headers: {
"Content-Type": "application/json",
"Authorization": "bearer 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
},"

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
