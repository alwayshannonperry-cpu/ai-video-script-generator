export default function handler(req, res) {

const topic = req.body?.topic || "something interesting"

const script = `
HOOK:
Stop scrolling if you want to learn about ${topic}.

SCRIPT:
Here are three quick tips about ${topic}.
1. Start simple
2. Be consistent
3. Improve every day

CAPTION:
Quick tips about ${topic} you should try today.

HASHTAGS:
#viral #tips #${topic.replace(/\s/g,"")}
`

res.status(200).json({ text: script })

}
