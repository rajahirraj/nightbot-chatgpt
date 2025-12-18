import express from "express";
import fetch from "node-fetch";

const app = express();

app.get("/", (req, res) => {
  res.send("ChatGPT Nightbot Running ✅");
});

app.get("/ask", async (req, res) => {
  try {
    const msg = req.query.msg;
    if (!msg) return res.send("Ask something");

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: msg }]
      })
    });

    const data = await response.json();

    // 🔴 ERROR HANDLING (VERY IMPORTANT)
    if (!data.choices || !data.choices[0]) {
      console.error("OpenAI Error:", data);
      return res.send("AI error, try again");
    }

    res.send(data.choices[0].message.content.slice(0, 350));

  } catch (err) {
    console.error("Server Error:", err);
    res.send("Server error");
  }
});

app.listen(process.env.PORT || 3000);
