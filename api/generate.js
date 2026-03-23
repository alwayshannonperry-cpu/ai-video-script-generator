<!DOCTYPE html>
<html>

<head>

<title>Viral Video Script Generator</title>

<style>
body{
  font-family: Arial, sans-serif;
  background:#f4f4f4;
  text-align:center;
  padding:40px;
}
.container{
  background:white;
  padding:30px;
  border-radius:10px;
  max-width:600px;
  margin:auto;
  box-shadow:0 5px 15px rgba(0,0,0,0.1);
}
input,select{
  width:80%;
  padding:10px;
  font-size:16px;
  margin-top:10px;
}
button{
  padding:10px 20px;
  font-size:16px;
  margin-top:10px;
  cursor:pointer;
}
#result{
  margin-top:20px;
  white-space:pre-wrap;
  text-align:left;
  background:#fafafa;
  padding:15px;
  border-radius:5px;
}
</style>

</head>

<body>

<div class="container">

<h1>Viral Video Script Generator</h1>
<p>Create TikTok, Reels, and Shorts scripts instantly.</p>

<input id="email" placeholder="Enter your email">

<br><br>

<input id="topic" placeholder="Enter video topic">

<br><br>

<select id="style">
  <option value="viral">Viral Hook</option>
  <option value="story">Storytelling</option>
  <option value="sales">Sales / Promotion</option>
</select>

<br><br>

<button onclick="generate()">Generate</button>
<button onclick="copyScript()">Copy</button>
<button onclick="clearScript()">Clear</button>
<button onclick="shareTool()">Share Tool</button>

<p id="result"></p>

<p>Free plan: 20 scripts per day | Pro version coming soon</p>

</div>

<script>
document.getElementById("topic").addEventListener("keypress", function(event){
  if(event.key==="Enter"){ generate() }
})

async function generate(){
  let email = document.getElementById("email").value
  let topic = document.getElementById("topic").value
  let style = document.getElementById("style").value

  if(!email){
    document.getElementById("result").innerText="Enter your email first."
    return
  }
  if(!topic){
    document.getElementById("result").innerText="Enter a topic."
    return
  }

  document.getElementById("result").innerText="Generating..."

  try{
    let response = await fetch("/api/generate",{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body: JSON.stringify({topic, style, email})
    })
    let data = await response.json()
    document.getElementById("result").innerText = data.text
  }catch(e){
    document.getElementById("result").innerText="Error generating script."
  }
}

function copyScript(){
  let text=document.getElementById("result").innerText
  if(!text) return alert("Nothing to copy yet.")
  navigator.clipboard.writeText(text)
  alert("Copied")
}

function clearScript(){
  document.getElementById("result").innerText=""
  document.getElementById("topic").value=""
}

function shareTool(){
  navigator.clipboard.writeText(window.location.href)
  alert("Link copied")
}
</script>

</body>
</html>
