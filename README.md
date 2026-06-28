# Ultimate Translator

An AI-powered translator web app built with **Flask**. It uses the [OpenRouter](https://openrouter.ai/) API (OpenAI-compatible) to translate text and to translate replies in a natural, conversational way that fits the original message.

## Features

- **Translate text** to any target language.
- **Reply translate**: paste a message you received plus your reply, and get a context-aware translation of your reply.
- Simple web UI (Tailwind CSS) served by Flask.
- Works with **free** OpenRouter models out of the box.

## Tech Stack

- Python 3 + Flask
- OpenRouter API via the `openai` Python SDK
- Jinja2 templates + Tailwind CSS (CDN)
- Deployable on Vercel as a Python serverless function

## API Endpoints

| Method | Path | Body | Description |
|--------|------|------|-------------|
| `GET`  | `/` | – | Renders the web UI. |
| `POST` | `/translate` | `{ "text", "target_language" }` | Translates `text` to `target_language`. |
| `POST` | `/reply-translate` | `{ "original_message", "your_reply", "target_language" }` | Translates your reply in the context of the original message. |

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `OPENAI_API_KEY` | Yes | Your **OpenRouter** API key (starts with `sk-or-...`). |
| `OPENROUTER_MODEL` | No | Model to use. Defaults to the free `meta-llama/llama-3.3-70b-instruct:free`. |
| `PORT` | No | Port for local run (defaults to `5000`). |

> **Note:** Although the variable is named `OPENAI_API_KEY`, the app talks to OpenRouter, so use your OpenRouter key. A regular OpenAI or Google AI Studio key will **not** work.

## Run Locally

1. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
2. Create a `.env` file in the project root:
   ```
   OPENAI_API_KEY=sk-or-your-openrouter-key
   OPENROUTER_MODEL=meta-llama/llama-3.3-70b-instruct:free
   ```
3. Start the server:
   ```bash
   python app.py
   ```
4. Open http://localhost:5000

> Add `.env` to your `.gitignore` and never commit your API key.

## Deploy on Vercel

This repo already includes a `vercel.json` configured for the Flask app.

1. Import the repository at [vercel.com/new](https://vercel.com/new).
2. Project settings:
   - **Framework Preset:** Other
   - **Build Command:** *(leave empty)*
   - **Output Directory:** *(leave empty)*
   - **Install Command:** *(leave empty — Vercel installs `requirements.txt` automatically)*
3. Add the environment variable in **Settings → Environment Variables**:
   - `OPENAI_API_KEY` = your OpenRouter key (`sk-or-...`)
   - (optional) `OPENROUTER_MODEL`
4. Deploy / Redeploy.

## Choosing a Model

Model names must use the `provider/model` format. Free models end with `:free`. Browse all free models at [openrouter.ai/models?max_price=0](https://openrouter.ai/models?max_price=0).

Examples:
- `meta-llama/llama-3.3-70b-instruct:free` (default)
- `google/gemini-2.0-flash-exp:free`
- `deepseek/deepseek-chat-v3-0324:free`

## License

MIT
