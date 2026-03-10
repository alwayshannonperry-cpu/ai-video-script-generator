let requests = {}

export default async function handler(req, res) {

if(req.method !== "POST"){
return res.status(405).json({text:"Method not allowed"})
}

const ip =
req.headers["x-forwarded-for"] ||
req.socket?.remoteAddress ||
"unknown"

const now = Date.now()

if(!requests[ip]){
requests[ip] = {count:0,time:now}
}

if(now - requests[ip].time > 86400000){
requests[ip] = {count:0,time:now}
}

if(requests[ip].count >= 20){
return res.status(429).json({
text:"Daily free limit reached. Try again tomorrow."
})
}

requests[ip].count++

const topic = req.body?.topic

if(!topic){
return res.status(400).json({
text:"Please enter a topic."
})
}

const script = `
HOOK:
Stop scrolling if you want to learn about ${topic}.

SCRIPT:
Here are three quick tips about ${topic}.
1. Start simple
2. Stay consistent
3. Improve daily

CAPTION:
Quick tips about ${topic} creators should try today.

HASHTAGS:
#shorts #contentcreator #${topic.replace(/\s/g,"")}
`

res.status(200).json({text:script})

}
