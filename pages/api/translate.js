export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { text, sourceLang, targetLang } = req.body;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `Bạn là trợ lý dịch thuật. Hãy dịch chính xác đoạn văn bản từ ${sourceLang} sang ${targetLang}.`
          },
          { role: "user", content: text }
        ],
      }),
    });

    const data = await response.json();

    if (data.error) {
      console.error("OpenAI API Error:", data.error);
      return res.status(500).json({ error: data.error.message });
    }

    const translated = data.choices[0].message.content;
    res.status(200).json({ translated });
  } catch (err) {
    console.error("Server Error:", err);
    res.status(500).json({ error: "Translation failed" });
  }
}
