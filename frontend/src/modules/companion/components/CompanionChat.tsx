import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Sparkles, Bot, User, ArrowLeft, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { askCompanion, fetchChatHistory } from "../services/companionService";

const GREETING = {
  role: "assistant",
  content: "Hello! I am your cognitive companion. I've been tracking your focus rhythms and consistency. How can I help you optimize your focus state today?"
};

export default function CompanionChat() {
  const [messages, setMessages] = useState<any[]>([GREETING]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Restore the conversation — the relationship shouldn't reset on refresh.
  useEffect(() => {
    fetchChatHistory()
      .then((history) => {
        if (history.length) {
          setMessages(history);
        }
      })
      .catch((error) => console.error("Could not load chat history", error));
  }, []);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput("");

    // Add user message
    setMessages((prev) => [...prev, { role: "user", content: userMsg }]);
    setLoading(true);

    try {
      const response = await askCompanion(userMsg);
      setMessages((prev) => [...prev, { role: "assistant", content: response.reply }]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I lost connection to my memory systems. Please verify your connection and try again."
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col h-[calc(100vh-8rem)]">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link
            to="/dashboard"
            className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition"
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <Sparkles size={20} className="text-indigo-400 animate-pulse" />
              <h1 className="text-3xl font-bold tracking-tight text-white">AI Companion</h1>
            </div>
            <p className="text-sm text-gray-400 mt-1">Your cognitive support environment</p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1.5 rounded-full">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-[12px] font-semibold text-indigo-300">Ambient Connected</span>
        </div>
      </div>

      {/* Chat Window */}
      <div className="flex-1 bg-[#0c0d1a]/80 backdrop-blur-xl border border-white/5 rounded-[32px] p-6 flex flex-col overflow-hidden shadow-2xl relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

        {/* Message Container */}
        <div className="flex-1 overflow-y-auto pr-2 space-y-6 scrollbar-thin scrollbar-thumb-white/10">
          <AnimatePresence initial={false}>
            {messages.map((msg, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className={`flex gap-4 max-w-[85%] ${msg.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"}`}
              >
                {/* Avatar */}
                <div
                  className={`w-10 h-10 rounded-xl shrink-0 flex items-center justify-center border transition-all duration-300 ${
                    msg.role === "user"
                      ? "bg-indigo-600/20 border-indigo-500/30 text-indigo-300 shadow-lg shadow-indigo-600/10"
                      : "bg-[#181c25] border-white/5 text-gray-400"
                  }`}
                >
                  {msg.role === "user" ? <User size={16} /> : <Bot size={16} className="text-indigo-400" />}
                </div>

                {/* Content Bubble */}
                <div
                  className={`p-4 rounded-2xl text-[14px] leading-relaxed shadow-lg whitespace-pre-line ${
                    msg.role === "user"
                      ? "bg-indigo-600 border border-indigo-500/20 text-white rounded-tr-none"
                      : "bg-[#181c25]/90 border border-white/5 text-gray-200 rounded-tl-none"
                  }`}
                >
                  {msg.content}
                </div>
              </motion.div>
            ))}

            {loading && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-4 max-w-[85%] mr-auto"
              >
                <div className="w-10 h-10 rounded-xl shrink-0 flex items-center justify-center border bg-[#181c25] border-white/5 text-gray-400">
                  <Bot size={16} className="text-indigo-400" />
                </div>
                <div className="bg-[#181c25]/90 border border-white/5 p-4 rounded-2xl rounded-tl-none flex items-center gap-2">
                  <Loader2 size={16} className="text-indigo-400 animate-spin" />
                  <span className="text-xs text-gray-400">Consulting behavioral memory...</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={chatEndRef} />
        </div>

        {/* Input Bar */}
        <div className="mt-6 flex gap-3 relative z-10">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Type a message or say 'I feel distracted'..."
            disabled={loading}
            className="flex-1 bg-[#181c25]/90 border border-white/5 rounded-2xl px-5 py-4 text-sm text-white placeholder-gray-500 outline-none focus:border-indigo-500/50 hover:border-white/10 transition"
          />
          <button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-800 disabled:text-gray-600 disabled:cursor-not-allowed text-white px-6 py-4 rounded-2xl font-semibold shadow-lg shadow-indigo-600/10 hover:shadow-indigo-600/20 active:scale-95 transition flex items-center gap-2"
          >
            <span>Send</span>
            <Send size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
