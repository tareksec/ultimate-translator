from flask import Flask, request, jsonify, render_template
from openai import OpenAI
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)
client = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY"),
    base_url="https://openrouter.ai/api/v1",
)

MODEL = os.getenv("OPENROUTER_MODEL", "openai/gpt-4o-mini")


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/translate", methods=["POST"])
def translate():
    data = request.get_json()
    text = data.get("text", "").strip()
    target_language = data.get("target_language", "English")

    if not text:
        return jsonify({"error": "No text provided"}), 400

    try:
        response = client.chat.completions.create(
            model=MODEL,
            messages=[
                {
                    "role": "system",
                    "content": (
                        f"You are a professional translator. Translate the following text to {target_language}. "
                        "Return only the translated text, nothing else."
                    ),
                },
                {"role": "user", "content": text},
            ],
        )
        translated = response.choices[0].message.content.strip()
        return jsonify({"translated": translated})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/reply-translate", methods=["POST"])
def reply_translate():
    data = request.get_json()
    original_message = data.get("original_message", "").strip()
    your_reply = data.get("your_reply", "").strip()
    target_language = data.get("target_language", "English")

    if not original_message or not your_reply:
        return jsonify({"error": "Both original message and your reply are required"}), 400

    try:
        response = client.chat.completions.create(
            model=MODEL,
            messages=[
                {
                    "role": "system",
                    "content": (
                        f"You are a professional translator. The user received a message and wrote a reply. "
                        f"Translate the reply to {target_language} in a natural, conversational way that fits "
                        f"the context of the original message. Return only the translated reply, nothing else."
                    ),
                },
                {
                    "role": "user",
                    "content": f"Original message received:\n{original_message}\n\nMy reply to translate:\n{your_reply}",
                },
            ],
        )
        translated_reply = response.choices[0].message.content.strip()
        return jsonify({"translated_reply": translated_reply})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    port = int(os.getenv("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=False)
