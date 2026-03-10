export default async function handler(req, res) {

const { topic } = req.body || {}

if (!topic) {
return res.status(400).json({ text: "Enter a topic first" })
}

const script = `
HOOK:
Stop scrolling if you want to learn about ${topic}.

SCRIPT:
Here are three quick tips about ${topic}.
Tip one: start simple.
Tip two: stay consistent.
Tip three: keep improving every day.

CAPTION:
Quick tips about ${topic} you should try today.

HASHTAGS:
#tips #learn #${topic.replace(/\s/g,"")}
`

res.status(200).json({ text: script })

}
