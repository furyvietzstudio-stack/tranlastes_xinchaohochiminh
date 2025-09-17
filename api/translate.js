export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { text, sourceLang, targetLang } = req.body;

  if (!text || !sourceLang || !targetLang) {
    return res.status(400).json({ error: "Thiếu dữ liệu!" });
  }

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
            content: `Bạn là một công cụ dịch thuật song ngữ. 
Chỉ dịch văn bản giữa tiếng Việt (${sourceLang}) và tiếng Hàn (${targetLang}). 
Trả về đúng bản dịch, không giải thích, không thêm ký hiệu.`
          },
          { role: "user", content: text }
        ],
        temperature: 0, // dịch sát nghĩa, ít sáng tạo
      }),
    });

    const data = await response.json();

    if (!response.ok || data.error) {
      console.error("OpenAI API Error:", data.error || data);
      return res.status(500).json({ error: data.error?.message || "OpenAI request failed" });
    }

    const translated = data.choices?.[0]?.message?.content?.trim();
    return res.status(200).json({ translated });
  } catch (err) {
    console.error("Server Error:", err);
    return res.status(500).json({ error: "Translation failed" });
  }
}
