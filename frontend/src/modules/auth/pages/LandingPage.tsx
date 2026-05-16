import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Play, Brain, CheckCircle, Zap, Shield, Star, Check } from "lucide-react";
import PageTransition from "../../../shared/components/PageTransition";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] } }),
};

const NAV_LINKS = ["Features", "How it works", "For Students", "For Professionals", "Pricing", "About"];

const PROBLEMS = [
  { icon: Play, title: "Starting is hard", sub: "Getting started feels overwhelming." },
  { icon: Zap, title: "Distractions win", sub: "Your attention gets pulled away." },
  { icon: CheckCircle, title: "Momentum fades", sub: "Small breaks turn into long delays." },
  { icon: Shield, title: "Guilt builds up", sub: "You feel stuck in the same cycle." },
];

const HOW_IT_WORKS = [
  { color: "#6366f1", emoji: "🧠", title: "A constant presence", sub: "Companion stays with you during your work sessions as a supportive partner." },
  { color: "#22c55e", emoji: "✅", title: "Accountability that helps", sub: "Smart check-ins and gentle nudges keep you aligned without pressure." },
  { color: "#3b82f6", emoji: "🎯", title: "Adaptive support", sub: "It understands your context and adapts to help you make better decisions." },
  { color: "#f59e0b", emoji: "📈", title: "Momentum that builds", sub: "Track progress, reflect, and build consistency that lasts over time." },
];

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <PageTransition>
      {/* Starfield */}
      <div className="starfield">
        <div className="starfield-glow" style={{ width: 600, height: 600, top: -100, right: -100, background: "rgba(99,102,241,0.12)" }} />
        <div className="starfield-glow" style={{ width: 400, height: 400, bottom: "20%", left: -100, background: "rgba(59,130,246,0.08)" }} />
      </div>

      {/* NAV */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        height: "60px", padding: "0 40px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: "rgba(7,7,26,0.8)", backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{ width: 28, height: 28, borderRadius: "50%", background: "linear-gradient(135deg, #6366f1, #818cf8)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12 }}>✦</div>
            <span style={{ fontWeight: 700, fontSize: "15px", color: "#f1f5f9" }}>Companion</span>
          </div>
          <div style={{ display: "flex", gap: "24px" }}>
            {NAV_LINKS.map(l => (
              <button key={l} style={{ background: "none", border: "none", color: "#94a3b8", fontSize: "13px", cursor: "pointer", fontFamily: "var(--font-sans)", padding: 0 }}>{l}</button>
            ))}
          </div>
        </div>
        <motion.button
          onClick={() => navigate("/signup")}
          whileHover={{ scale: 1.04, boxShadow: "0 0 20px rgba(99,102,241,0.5)" }}
          whileTap={{ scale: 0.97 }}
          style={{ padding: "8px 20px", borderRadius: "9px", border: "none", background: "linear-gradient(135deg,#6366f1,#818cf8)", color: "#fff", fontWeight: 600, fontSize: "13px", cursor: "pointer", fontFamily: "var(--font-sans)" }}
        >
          Get Started
        </motion.button>
      </nav>

      {/* HERO */}
      <section style={{ minHeight: "100vh", display: "flex", alignItems: "center", padding: "80px 80px 60px", position: "relative", zIndex: 1, gap: "60px", background: "var(--bg-primary)" }}>
        {/* Left */}
        <div style={{ flex: 1, maxWidth: "540px" }}>
          <motion.div custom={0} variants={fadeUp} initial="hidden" animate="show" style={{ marginBottom: "24px" }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "5px 14px", borderRadius: "100px", border: "1px solid rgba(99,102,241,0.35)", background: "rgba(99,102,241,0.08)", fontSize: "12px", color: "#818cf8", fontWeight: 500 }}>
              ✦ Your AI Companion for Focus & Consistency
            </span>
          </motion.div>

          <motion.h1 custom={1} variants={fadeUp} initial="hidden" animate="show"
            style={{ fontWeight: 800, fontSize: "clamp(38px,5vw,58px)", lineHeight: 1.1, margin: "0 0 20px", color: "#f1f5f9" }}>
            Focus becomes easier<br />
            when you're{" "}
            <span style={{ background: "linear-gradient(90deg,#6366f1,#a5b4fc)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              not alone.
            </span>
          </motion.h1>

          <motion.p custom={2} variants={fadeUp} initial="hidden" animate="show"
            style={{ color: "#94a3b8", fontSize: "16px", lineHeight: 1.7, margin: "0 0 36px", maxWidth: "420px" }}>
            Companion is an AI cognitive companion that stays with you during deep work, keeps you accountable, and helps you build lasting discipline.
          </motion.p>

          <motion.div custom={3} variants={fadeUp} initial="hidden" animate="show" style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginBottom: "40px" }}>
            <motion.button onClick={() => navigate("/signup")} whileHover={{ scale: 1.04, boxShadow: "0 0 30px rgba(99,102,241,0.5)" }} whileTap={{ scale: 0.97 }}
              style={{ display: "flex", alignItems: "center", gap: "8px", padding: "13px 24px", borderRadius: "10px", border: "none", background: "linear-gradient(135deg,#6366f1,#818cf8)", color: "#fff", fontWeight: 600, fontSize: "14px", cursor: "pointer", fontFamily: "var(--font-sans)" }}>
              Start your journey <ArrowRight size={15} />
            </motion.button>
            <button style={{ display: "flex", alignItems: "center", gap: "8px", padding: "13px 24px", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.12)", background: "none", color: "#f1f5f9", fontWeight: 500, fontSize: "14px", cursor: "pointer", fontFamily: "var(--font-sans)" }}>
              <Play size={14} fill="#f1f5f9" /> See how it works
            </button>
          </motion.div>

          {/* Pills */}
          <motion.div custom={4} variants={fadeUp} initial="hidden" animate="show" style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
            {["AI Companion", "Real-time Accountability", "Adaptive Support", "Privacy First"].map(p => (
              <span key={p} style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "11px", color: "#64748b" }}>
                <Check size={10} color="#6366f1" />{p}
              </span>
            ))}
          </motion.div>
        </div>

        {/* Right — Orb + Chat bubbles */}
        <motion.div custom={2} variants={fadeUp} initial="hidden" animate="show"
          style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", minHeight: "500px" }}>
          {/* Orb */}
          <motion.div
            animate={{ y: [0, -14, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            style={{
              width: 260, height: 260, borderRadius: "50%",
              background: "radial-gradient(circle at 35% 35%, #818cf8 0%, #6366f1 40%, #312e81 75%, #1e1b4b 100%)",
              boxShadow: "0 0 80px 20px rgba(99,102,241,0.35), inset 0 0 40px rgba(255,255,255,0.05)",
              animation: "pulse-glow 4s ease-in-out infinite",
              display: "flex", alignItems: "center", justifyContent: "center",
              position: "relative",
            }}
          >
            {/* Face */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px", opacity: 0.8 }}>
              <div style={{ display: "flex", gap: "24px" }}>
                <div style={{ width: 10, height: 4, borderRadius: 10, background: "rgba(255,255,255,0.7)" }} />
                <div style={{ width: 10, height: 4, borderRadius: 10, background: "rgba(255,255,255,0.7)" }} />
              </div>
            </div>
          </motion.div>

          {/* Chat bubble 1 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            style={{
              position: "absolute", top: "12%", right: "5%",
              background: "rgba(15,15,42,0.9)", border: "1px solid rgba(99,102,241,0.3)",
              backdropFilter: "blur(12px)", borderRadius: "12px 12px 2px 12px",
              padding: "10px 14px", fontSize: "12px", color: "#f1f5f9", maxWidth: "160px",
              boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
            }}
          >
            How's your focus today?
          </motion.div>

          {/* Chat bubble 2 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.2, duration: 0.5 }}
            style={{
              position: "absolute", bottom: "22%", left: "2%",
              background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.3)",
              backdropFilter: "blur(12px)", borderRadius: "12px 12px 12px 2px",
              padding: "10px 14px", fontSize: "12px", color: "#f1f5f9", maxWidth: "160px",
              boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
            }}
          >
            You've got this. I'm here with you 💙
          </motion.div>

          {/* Chat bubble 3 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.6, duration: 0.5 }}
            style={{
              position: "absolute", bottom: "8%", right: "8%",
              background: "rgba(15,15,42,0.9)", border: "1px solid rgba(255,255,255,0.08)",
              backdropFilter: "blur(12px)", borderRadius: "12px 12px 2px 12px",
              padding: "10px 14px", fontSize: "12px", color: "#f1f5f9", maxWidth: "160px",
              boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
            }}
          >
            Shall we start a focus session?
          </motion.div>
        </motion.div>
      </section>

      {/* THE REAL PROBLEM */}
      <section style={{ padding: "80px 80px", position: "relative", zIndex: 1, background: "var(--bg-primary)" }}>
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
          <p style={{ fontSize: "11px", fontWeight: 700, color: "#6366f1", letterSpacing: "0.12em", textTransform: "uppercase", margin: "0 0 20px" }}>THE REAL PROBLEM</p>
          <div style={{ display: "flex", gap: "60px", alignItems: "flex-start", flexWrap: "wrap" }}>
            <div style={{ flex: "0 0 280px" }}>
              <h2 style={{ fontWeight: 800, fontSize: "clamp(24px,3vw,36px)", lineHeight: 1.2, margin: "0 0 12px", color: "#f1f5f9" }}>
                You know what to do.<br />
                But it's hard to{" "}
                <span style={{ background: "linear-gradient(90deg,#6366f1,#a5b4fc)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                  stay consistent.
                </span>
              </h2>
              <p style={{ color: "#64748b", fontSize: "14px", lineHeight: 1.6, margin: 0 }}>
                We all face the same challenges that break our momentum.
              </p>
            </div>
            <div style={{ flex: 1, display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: "28px" }}>
              {PROBLEMS.map(({ icon: Icon, title, sub }) => (
                <div key={title}>
                  <div style={{ width: 36, height: 36, borderRadius: "8px", background: "rgba(99,102,241,0.1)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "10px" }}>
                    <Icon size={16} color="#818cf8" />
                  </div>
                  <p style={{ fontWeight: 600, fontSize: "13px", color: "#f1f5f9", margin: "0 0 4px" }}>{title}</p>
                  <p style={{ fontSize: "12px", color: "#64748b", margin: 0, lineHeight: 1.5 }}>{sub}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ padding: "80px", position: "relative", zIndex: 1, background: "var(--bg-primary)" }}>
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} style={{ textAlign: "center", marginBottom: "56px" }}>
          <h2 style={{ fontWeight: 700, fontSize: "clamp(24px,3vw,40px)", margin: "0 0 12px", color: "#f1f5f9" }}>How Companion works</h2>
          <p style={{ color: "#64748b", fontSize: "15px", margin: 0 }}>An intelligent companion that supports you through every step.</p>
        </motion.div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: "20px", maxWidth: "1100px", margin: "0 auto" }}>
          {HOW_IT_WORKS.map(({ color, emoji, title, sub }, i) => (
            <motion.div key={title}
              initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.55 }}
              whileHover={{ y: -5, boxShadow: `0 12px 32px rgba(0,0,0,0.3)` }}
              className="glass"
              style={{ borderRadius: "16px", padding: "28px 24px" }}>
              <div style={{ width: 44, height: 44, borderRadius: "12px", background: `${color}20`, border: `1px solid ${color}40`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", marginBottom: "16px" }}>
                {emoji}
              </div>
              <h3 style={{ fontWeight: 600, fontSize: "15px", color: "#f1f5f9", margin: "0 0 8px" }}>{title}</h3>
              <p style={{ fontSize: "13px", color: "#64748b", margin: 0, lineHeight: 1.6 }}>{sub}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA FOOTER */}
      <section style={{ padding: "60px 80px 80px", position: "relative", zIndex: 1, background: "var(--bg-primary)" }}>
        <motion.div
          initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
          style={{
            maxWidth: "900px", margin: "0 auto",
            borderRadius: "20px", border: "1px solid rgba(255,255,255,0.06)",
            background: "rgba(15,15,42,0.7)", backdropFilter: "blur(16px)",
            padding: "32px 40px",
            display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "20px",
          }}
        >
          <div style={{ display: "flex", gap: "32px", flexWrap: "wrap" }}>
            {[
              { emoji: "🔒", label: "Privacy First", sub: "Your data is private and never sold." },
              { emoji: "📈", label: "Built for Long-Term Growth", sub: "Companion focuses on helping you build habits that last." },
              { emoji: "❤️", label: "Loved by Focused People", sub: "Students, creators, and professionals trust Companion." },
            ].map(({ emoji, label, sub }) => (
              <div key={label} style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                <span style={{ fontSize: "18px" }}>{emoji}</span>
                <div>
                  <p style={{ margin: 0, fontSize: "12px", fontWeight: 600, color: "#f1f5f9" }}>{label}</p>
                  <p style={{ margin: 0, fontSize: "11px", color: "#475569", lineHeight: 1.4 }}>{sub}</p>
                </div>
              </div>
            ))}
          </div>
          <motion.button
            onClick={() => navigate("/signup")}
            whileHover={{ scale: 1.04, boxShadow: "0 0 24px rgba(99,102,241,0.5)" }}
            whileTap={{ scale: 0.97 }}
            style={{ display: "flex", alignItems: "center", gap: "8px", padding: "12px 22px", borderRadius: "10px", border: "none", background: "linear-gradient(135deg,#6366f1,#818cf8)", color: "#fff", fontWeight: 600, fontSize: "13px", cursor: "pointer", fontFamily: "var(--font-sans)", whiteSpace: "nowrap" }}
          >
            Start your journey <ArrowRight size={14} />
          </motion.button>
        </motion.div>
      </section>
    </PageTransition>
  );
}
