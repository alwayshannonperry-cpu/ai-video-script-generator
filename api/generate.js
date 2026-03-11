let requests = {}

export default function handler(req,res){

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
text:"Daily free limit reached"
})
}

requests[ip].count++

const topic=req.body?.topic
const style=req.body?.style || "viral"

if(!topic){
return res.status(400).json({text:"Enter topic"})
}

let script=""

if(style==="viral"){
script=`
TITLE:
The Truth About ${topic}

HOOK:
Stop scrolling if you care about ${topic}

SCRIPT:
Most people do ${topic} wrong.
Here are 3 quick tips.

Tip 1
Tip 2
Tip 3

CAPTION:
Quick ${topic} tips creators should know.

HASHTAGS:
#viral #shorts #${topic.replace(/\s/g,"")}
`
}

if(style==="story"){
script=`
TITLE:
My Experience With ${topic}

HOOK:
I tried ${topic} for 30 days.

SCRIPT:
At first it was difficult.
But then something surprising happened.

Here is what I learned.

CAPTION:
Real story about ${topic}

HASHTAGS:
#storytime #shorts #${topic.replace(/\s/g,"")}
`
}

if(style==="sales"){
script=`
TITLE:
Why You Need ${topic}

HOOK:
If you struggle with ${topic} watch this.

SCRIPT:
Most people waste time doing it wrong.

Here is the solution.

CAPTION:
Better results with ${topic}

HASHTAGS:
#marketing #shorts #${topic.replace(/\s/g,"")}
`
}

res.status(200).json({text:script})

}
