import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Eye, EyeOff, Mail, Lock, Shield, Radio, Target } from "lucide-react";
import PageTransition from "../../../shared/components/PageTransition";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  }),
};

const TRUST_BADGES = [
  { icon: Shield, label: "Secure & Private", sub: "Your data is encrypted and protected." },
  { icon: Radio, label: "No Tracking", sub: "We respect your privacy. No ads. No tracking." },
  { icon: Target, label: "Focus First", sub: "Designed to help you focus and grow." },
];

export default function LoginPage() {
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1400));
    setLoading(false);
    navigate("/dashboard");
  };

  return (
    <PageTransition>
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          background: "var(--bg-primary)",
        }}
      >
        {/* ── Main split layout ── */}
        <div style={{ flex: 1, display: "flex", minHeight: "100vh" }}>

          {/* ── LEFT PANEL — Hero Image ── */}
          <div
            style={{
              flex: 1,
              position: "relative",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              minHeight: "100vh",
            }}
          >
            {/* Background image */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                backgroundImage: "url('/login-hero.png')",
                backgroundSize: "cover",
                backgroundPosition: "center 30%",
              }}
            />

            {/* Dark overlay */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(to bottom, rgba(7,7,26,0.45) 0%, rgba(7,7,26,0.2) 40%, rgba(7,7,26,0.75) 100%)",
              }}
            />

            {/* Purple tint overlay */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(135deg, rgba(99,102,241,0.15) 0%, transparent 60%)",
              }}
            />

            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              style={{
                position: "relative",
                zIndex: 2,
                padding: "28px 32px",
                display: "flex",
                alignItems: "center",
                gap: "9px",
              }}
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #6366f1, #818cf8)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 0 16px rgba(99,102,241,0.5)",
                }}
              >
                <span style={{ fontSize: 14 }}>✦</span>
              </div>
              <span
                style={{
                  fontWeight: 700,
                  fontSize: "17px",
                  color: "#f1f5f9",
                  letterSpacing: "-0.01em",
                }}
              >
                Companion
              </span>
            </motion.div>

            {/* Center text */}
            <div style={{ flex: 1, position: "relative", zIndex: 2, display: "flex", alignItems: "center", padding: "0 48px" }}>
              <motion.div
                initial={{ opacity: 0, y: 32 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              >
                <h2
                  style={{
                    fontWeight: 800,
                    fontSize: "clamp(28px, 3.5vw, 44px)",
                    lineHeight: 1.15,
                    margin: "0 0 12px",
                    color: "#f1f5f9",
                    maxWidth: "400px",
                  }}
                >
                  A calmer mind.{"\n"}
                  <br />
                  Stronger focus.{"\n"}
                  <br />
                  <span
                    style={{
                      background: "linear-gradient(90deg, #818cf8, #a5b4fc)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    Better you.
                  </span>
                </h2>
                <p style={{ color: "rgba(241,245,249,0.7)", fontSize: "15px", lineHeight: 1.6, margin: 0, maxWidth: "340px" }}>
                  Your AI companion for focus, consistency and growth.
                </p>
              </motion.div>
            </div>

            {/* Quote */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.7 }}
              style={{
                position: "relative",
                zIndex: 2,
                padding: "0 48px 36px",
              }}
            >
              <div
                style={{
                  borderLeft: "3px solid rgba(99,102,241,0.6)",
                  paddingLeft: "16px",
                }}
              >
                <p
                  style={{
                    margin: "0 0 6px",
                    fontSize: "13px",
                    color: "rgba(241,245,249,0.65)",
                    lineHeight: 1.6,
                    maxWidth: "340px",
                    fontStyle: "italic",
                  }}
                >
                  "The highest form of productivity is working on the right things with a peaceful mind."
                </p>
                <p style={{ margin: 0, fontSize: "12px", color: "rgba(241,245,249,0.4)" }}>— Unknown</p>
              </div>
            </motion.div>

            {/* Bottom trust bar */}
            <div
              style={{
                position: "relative",
                zIndex: 2,
                borderTop: "1px solid rgba(255,255,255,0.08)",
                padding: "18px 32px",
                display: "flex",
                gap: "32px",
                background: "rgba(7,7,26,0.6)",
                backdropFilter: "blur(12px)",
                flexWrap: "wrap",
              }}
            >
              {TRUST_BADGES.map(({ icon: Icon, label, sub }) => (
                <div key={label} style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                  <Icon size={14} color="rgba(99,102,241,0.8)" style={{ marginTop: 2, flexShrink: 0 }} />
                  <div>
                    <p style={{ margin: 0, fontSize: "11px", fontWeight: 600, color: "rgba(241,245,249,0.8)" }}>{label}</p>
                    <p style={{ margin: 0, fontSize: "10px", color: "rgba(241,245,249,0.4)", lineHeight: 1.4 }}>{sub}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Copyright */}
            <div
              style={{
                position: "relative",
                zIndex: 2,
                padding: "10px 32px",
                background: "rgba(7,7,26,0.7)",
              }}
            >
              <p style={{ margin: 0, fontSize: "10px", color: "rgba(241,245,249,0.25)" }}>
                © 2024 Companion. All rights reserved.
              </p>
            </div>
          </div>

          {/* ── RIGHT PANEL — Form ── */}
          <div
            style={{
              width: "420px",
              flexShrink: 0,
              background: "#f8f9fc",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "48px 40px",
              position: "relative",
            }}
          >
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              style={{ width: "100%", maxWidth: "340px" }}
            >
              {/* Heading */}
              <motion.div custom={0} variants={fadeUp} initial="hidden" animate="show" style={{ marginBottom: "32px" }}>
                <h1
                  style={{
                    fontWeight: 800,
                    fontSize: "26px",
                    color: "#0f172a",
                    margin: "0 0 6px",
                    fontFamily: "var(--font-sans)",
                    letterSpacing: "-0.02em",
                  }}
                >
                  Welcome back 👋
                </h1>
                <p style={{ margin: 0, fontSize: "14px", color: "#64748b" }}>
                  Sign in to continue your journey
                </p>
              </motion.div>

              {/* OAuth Buttons */}
              <motion.div custom={1} variants={fadeUp} initial="hidden" animate="show" style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "20px" }}>
                <OAuthButton
                  icon={
                    <svg width="18" height="18" viewBox="0 0 24 24">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    </svg>
                  }
                  label="Continue with Google"
                />
                <OAuthButton
                  icon={
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="#0f172a">
                      <path d="M12.017 0C8.396.02 5.5 2.37 5.5 2.37S2.617 4.97 2.617 9.157c0 4.853 3.518 9.43 5.58 9.43.95 0 1.87-.553 2.82-.553.95 0 1.87.553 2.82.553 2.06 0 5.58-4.577 5.58-9.43 0-4.188-2.883-6.787-2.883-6.787S13.638.02 12.017 0zm.47 5.13c.57-.77 1.54-1.3 2.35-1.34-.08 1.05-.46 2.02-1.04 2.75-.57.74-1.51 1.28-2.37 1.21.1-1.06.49-2 1.06-2.62z" />
                    </svg>
                  }
                  label="Continue with Apple"
                />
              </motion.div>

              {/* Divider */}
              <motion.div
                custom={2}
                variants={fadeUp}
                initial="hidden"
                animate="show"
                style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}
              >
                <div style={{ flex: 1, height: 1, background: "#e2e8f0" }} />
                <span style={{ fontSize: "12px", color: "#94a3b8" }}>or</span>
                <div style={{ flex: 1, height: 1, background: "#e2e8f0" }} />
              </motion.div>

              {/* Form */}
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>

                <motion.div custom={3} variants={fadeUp} initial="hidden" animate="show">
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 500, color: "#475569", marginBottom: "6px" }}>
                    Email address
                  </label>
                  <LightInputField
                    id="email"
                    type="email"
                    value={email}
                    onChange={setEmail}
                    placeholder="you@example.com"
                    icon={<Mail size={14} color={focused === "email" ? "#6366f1" : "#94a3b8"} />}
                    focused={focused}
                    setFocused={setFocused}
                  />
                </motion.div>

                <motion.div custom={4} variants={fadeUp} initial="hidden" animate="show">
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 500, color: "#475569", marginBottom: "6px" }}>
                    Password
                  </label>
                  <LightInputField
                    id="password"
                    type={showPass ? "text" : "password"}
                    value={password}
                    onChange={setPassword}
                    placeholder="Enter your password"
                    icon={<Lock size={14} color={focused === "password" ? "#6366f1" : "#94a3b8"} />}
                    focused={focused}
                    setFocused={setFocused}
                    endAdornment={
                      <button type="button" onClick={() => setShowPass((p) => !p)}
                        style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8", padding: 0, display: "flex" }}>
                        {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                    }
                  />
                </motion.div>

                {/* Remember + Forgot */}
                <motion.div
                  custom={5}
                  variants={fadeUp}
                  initial="hidden"
                  animate="show"
                  style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}
                >
                  <label style={{ display: "flex", alignItems: "center", gap: "7px", cursor: "pointer" }}>
                    <input
                      type="checkbox"
                      checked={remember}
                      onChange={(e) => setRemember(e.target.checked)}
                      style={{ accentColor: "#6366f1", width: 14, height: 14 }}
                    />
                    <span style={{ fontSize: "12px", color: "#64748b" }}>Remember me</span>
                  </label>
                  <button type="button" style={{ background: "none", border: "none", cursor: "pointer", fontSize: "12px", color: "#6366f1", fontWeight: 500, padding: 0 }}>
                    Forgot password?
                  </button>
                </motion.div>

                {/* Submit */}
                <motion.div custom={6} variants={fadeUp} initial="hidden" animate="show" style={{ marginTop: "4px" }}>
                  <motion.button
                    type="submit"
                    disabled={loading}
                    whileHover={{ scale: 1.02, boxShadow: "0 4px 24px rgba(99,102,241,0.45)" }}
                    whileTap={{ scale: 0.98 }}
                    style={{
                      width: "100%",
                      padding: "13px",
                      borderRadius: "10px",
                      border: "none",
                      background: loading ? "rgba(99,102,241,0.6)" : "linear-gradient(135deg, #6366f1 0%, #818cf8 100%)",
                      color: "#fff",
                      fontWeight: 600,
                      fontSize: "14px",
                      cursor: loading ? "not-allowed" : "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                      fontFamily: "var(--font-sans)",
                      letterSpacing: "0.01em",
                      transition: "background 0.3s",
                    }}
                  >
                    <AnimatePresence mode="wait">
                      {loading ? (
                        <motion.div key="spin" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                          style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.7s linear infinite" }}
                        />
                      ) : (
                        <motion.span key="txt" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                          Sign in
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.button>
                </motion.div>
              </form>

              {/* Signup link */}
              <motion.p
                custom={7}
                variants={fadeUp}
                initial="hidden"
                animate="show"
                style={{ textAlign: "center", marginTop: "24px", fontSize: "13px", color: "#64748b", marginBottom: 0 }}
              >
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={() => navigate("/signup")}
                  style={{ background: "none", border: "none", cursor: "pointer", color: "#6366f1", fontWeight: 600, fontSize: "13px", padding: 0 }}
                >
                  Create one
                </button>
              </motion.p>
            </motion.div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}

/* ─── Light Input ─── */
interface LightInputFieldProps {
  id: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  icon: React.ReactNode;
  focused: string | null;
  setFocused: (v: string | null) => void;
  endAdornment?: React.ReactNode;
}

function LightInputField({ id, type, value, onChange, placeholder, icon, focused, setFocused, endAdornment }: LightInputFieldProps) {
  const isFocused = focused === id;
  return (
    <motion.div
      animate={{
        borderColor: isFocused ? "#6366f1" : "#e2e8f0",
        boxShadow: isFocused ? "0 0 0 3px rgba(99,102,241,0.12)" : "none",
      }}
      transition={{ duration: 0.18 }}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        padding: "0 13px",
        borderRadius: "9px",
        border: "1.5px solid #e2e8f0",
        background: "#fff",
        height: "44px",
      }}
    >
      <span style={{ display: "flex", flexShrink: 0 }}>{icon}</span>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        onFocus={() => setFocused(id)}
        onBlur={() => setFocused(null)}
        style={{
          flex: 1,
          background: "none",
          border: "none",
          outline: "none",
          color: "#0f172a",
          fontSize: "13px",
          fontFamily: "var(--font-sans)",
        }}
      />
      {endAdornment}
    </motion.div>
  );
}

/* ─── OAuth Button ─── */
function OAuthButton({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <motion.button
      type="button"
      whileHover={{ scale: 1.01, boxShadow: "0 2px 12px rgba(0,0,0,0.1)" }}
      whileTap={{ scale: 0.99 }}
      style={{
        width: "100%",
        padding: "11px 16px",
        borderRadius: "9px",
        border: "1.5px solid #e2e8f0",
        background: "#fff",
        display: "flex",
        alignItems: "center",
        gap: "10px",
        cursor: "pointer",
        fontSize: "13px",
        fontWeight: 500,
        color: "#0f172a",
        fontFamily: "var(--font-sans)",
      }}
    >
      {icon}
      <span style={{ flex: 1, textAlign: "center" }}>{label}</span>
    </motion.button>
  );
}