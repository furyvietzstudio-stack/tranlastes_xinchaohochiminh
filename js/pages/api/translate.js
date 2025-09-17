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
            content: `You are a translation assistant. Translate the following text from ${sourceLang} to ${targetLang}. Only return the translated text.`
          },
          { role: "user", content: text }
        ],
      }),
    });

    const data = await response.json();
    const translated = data.choices[0].message.content;

    res.status(200).json({ translated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Translation failed" });
  }
}
