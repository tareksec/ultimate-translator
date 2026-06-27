import { useState, useCallback } from "react";

const LANGUAGES = [
  "English", "Spanish", "French", "German", "Italian", "Portuguese",
  "Japanese", "Korean", "Chinese (Simplified)", "Chinese (Traditional)",
  "Arabic", "Hindi", "Russian", "Dutch", "Polish", "Turkish",
  "Vietnamese", "Thai", "Indonesian", "Malay", "Swedish", "Norwegian",
  "Danish", "Finnish", "Greek", "Czech", "Romanian", "Hungarian",
  "Ukrainian", "Hebrew",
];

type Tab = "translate" | "reply";

async function apiPost(path: string, body: Record<string, string>) {
  const res = await fetch(`/api${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return res.json();
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };
  return (
    <button
      onClick={copy}
      className="mt-2 text-xs text-indigo-500 hover:text-indigo-700 flex items-center gap-1 transition-colors"
    >
      {copied ? (
        <>
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Copied!
        </>
      ) : (
        <>
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          Copy
        </>
      )}
    </button>
  );
}

function TranslateTab({ targetLanguage }: { targetLanguage: string }) {
  const [text, setText] = useState("");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const run = useCallback(async () => {
    if (!text.trim()) return;
    setLoading(true); setResult(""); setError("");
    const data = await apiPost("/translate", { text, target_language: targetLanguage });
    setLoading(false);
    if (data.error) setError(data.error);
    else setResult(data.translated ?? "");
  }, [text, targetLanguage]);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-4">
      <div>
        <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Text to Translate</label>
        <textarea
          rows={5}
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={e => { if ((e.ctrlKey || e.metaKey) && e.key === "Enter") run(); }}
          placeholder="Type or paste text here…"
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 focus:ring-2 focus:ring-indigo-300 focus:outline-none placeholder-gray-300 resize-y"
        />
      </div>
      <button
        onClick={run}
        disabled={loading || !text.trim()}
        className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 active:scale-95 text-white text-sm font-semibold py-3 rounded-xl transition-all flex items-center justify-center gap-2"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
        {loading ? "Translating…" : "Translate"}
      </button>
      {result && (
        <div className="animate-in fade-in slide-in-from-bottom-1 duration-300">
          <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Translation</label>
          <div className="bg-indigo-50 border border-indigo-100 rounded-xl px-4 py-3 text-sm text-gray-800 whitespace-pre-wrap">{result}</div>
          <CopyButton text={result} />
        </div>
      )}
      {error && (
        <div className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-xl px-4 py-3">{error}</div>
      )}
    </div>
  );
}

function ReplyTab({ targetLanguage }: { targetLanguage: string }) {
  const [original, setOriginal] = useState("");
  const [reply, setReply] = useState("");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const run = useCallback(async () => {
    if (!original.trim() || !reply.trim()) return;
    setLoading(true); setResult(""); setError("");
    const data = await apiPost("/reply-translate", {
      original_message: original,
      your_reply: reply,
      target_language: targetLanguage,
    });
    setLoading(false);
    if (data.error) setError(data.error);
    else setResult(data.translated_reply ?? "");
  }, [original, reply, targetLanguage]);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-4">
      <div>
        <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Message You Received</label>
        <textarea
          rows={3}
          value={original}
          onChange={e => setOriginal(e.target.value)}
          placeholder="Paste the message you received here…"
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 focus:ring-2 focus:ring-indigo-300 focus:outline-none placeholder-gray-300 resize-y"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Your Reply (any language)</label>
        <textarea
          rows={3}
          value={reply}
          onChange={e => setReply(e.target.value)}
          onKeyDown={e => { if ((e.ctrlKey || e.metaKey) && e.key === "Enter") run(); }}
          placeholder="Write your reply here in any language…"
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 focus:ring-2 focus:ring-indigo-300 focus:outline-none placeholder-gray-300 resize-y"
        />
      </div>
      <button
        onClick={run}
        disabled={loading || !original.trim() || !reply.trim()}
        className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 active:scale-95 text-white text-sm font-semibold py-3 rounded-xl transition-all flex items-center justify-center gap-2"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
        </svg>
        {loading ? "Translating…" : "Translate My Reply"}
      </button>
      {result && (
        <div className="animate-in fade-in slide-in-from-bottom-1 duration-300">
          <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Translated Reply</label>
          <div className="bg-indigo-50 border border-indigo-100 rounded-xl px-4 py-3 text-sm text-gray-800 whitespace-pre-wrap">{result}</div>
          <CopyButton text={result} />
        </div>
      )}
      {error && (
        <div className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-xl px-4 py-3">{error}</div>
      )}
    </div>
  );
}

export default function App() {
  const [tab, setTab] = useState<Tab>("translate");
  const [targetLanguage, setTargetLanguage] = useState("English");

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-3xl mx-auto px-4 py-5 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">AI Translator</h1>
            <p className="text-xs text-gray-400">Powered by GPT-4o mini</p>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8 w-full flex-1">
        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-6">
          {(["translate", "reply"] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-5 py-3 text-sm transition-colors focus:outline-none ${
                tab === t
                  ? "border-b-[3px] border-indigo-500 text-indigo-600 font-semibold"
                  : "text-gray-500 hover:text-indigo-600"
              }`}
            >
              {t === "translate" ? "Translate" : "Reply & Translate"}
            </button>
          ))}
        </div>

        {/* Language selector */}
        <div className="mb-5">
          <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Target Language</label>
          <select
            value={targetLanguage}
            onChange={e => setTargetLanguage(e.target.value)}
            className="w-full sm:w-64 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 bg-white shadow-sm focus:ring-2 focus:ring-indigo-300 focus:outline-none"
          >
            {LANGUAGES.map(l => <option key={l}>{l}</option>)}
          </select>
        </div>

        {tab === "translate" ? (
          <TranslateTab targetLanguage={targetLanguage} />
        ) : (
          <ReplyTab targetLanguage={targetLanguage} />
        )}
      </main>

      <footer className="text-center text-xs text-gray-300 py-4">AI Translator — personal use</footer>
    </div>
  );
}
