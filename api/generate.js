export default async function handler(req, res) {
  try {

    const { topic, pro } = req.body;

    const prompt = pro
      ? `Write a HIGHLY viral TikTok script about ${topic}. Include:
HOOK (pattern interrupt),
SCRIPT (high engagement),
CAPTION (optimized),
HASHTAGS (trending).`
      : `Write a simple basic TikTok script about ${topic}. Include:
HOOK,
SCRIPT,
CAPTION,
HASHTAGS.`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "user", content: prompt }
        ]
      })
    });

    const data = await response.json();

    // 🔥 LOG FULL RESPONSE
    console.log("OPENAI RESPONSE:", JSON.stringify(data));

    // ✅ SAFE CHECK
    if (!data.choices) {
      return res.status(500).json({
        text: "OpenAI error: " + JSON.stringify(data)
      });
    }

    res.status(200).json({
      text: data.choices[0].message.content
    });

  } catch (error) {
    console.error("SERVER ERROR:", error);
    res.status(500).json({
      text: "Server error generating script"
    });
  }
}
