import { Router } from "express";
import OpenAI from "openai";

const router = Router();
const client = new OpenAI({ apiKey: process.env["OPENAI_API_KEY"] });

router.post("/translate", async (req, res) => {
  const { text, target_language } = req.body as {
    text?: string;
    target_language?: string;
  };

  if (!text?.trim()) {
    res.status(400).json({ error: "No text provided" });
    return;
  }

  const lang = target_language ?? "English";

  try {
    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are a professional translator. Translate the following text to ${lang}. Return only the translated text, nothing else.`,
        },
        { role: "user", content: text.trim() },
      ],
    });
    res.json({ translated: response.choices[0]?.message.content?.trim() });
  } catch (err) {
    req.log.error({ err }, "Translation failed");
    res.status(500).json({ error: "Translation failed" });
  }
});

router.post("/reply-translate", async (req, res) => {
  const { original_message, your_reply, target_language } = req.body as {
    original_message?: string;
    your_reply?: string;
    target_language?: string;
  };

  if (!original_message?.trim() || !your_reply?.trim()) {
    res.status(400).json({ error: "Both original message and your reply are required" });
    return;
  }

  const lang = target_language ?? "English";

  try {
    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are a professional translator. The user received a message and wrote a reply. Translate the reply to ${lang} in a natural, conversational way that fits the context of the original message. Return only the translated reply, nothing else.`,
        },
        {
          role: "user",
          content: `Original message received:\n${original_message.trim()}\n\nMy reply to translate:\n${your_reply.trim()}`,
        },
      ],
    });
    res.json({ translated_reply: response.choices[0]?.message.content?.trim() });
  } catch (err) {
    req.log.error({ err }, "Reply translation failed");
    res.status(500).json({ error: "Translation failed" });
  }
});

export default router;
