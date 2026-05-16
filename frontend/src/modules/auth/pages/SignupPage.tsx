import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Eye, EyeOff, ArrowRight, Sparkles, Lock, Mail, User } from "lucide-react";
import PageTransition from "../../../shared/components/PageTransition";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.07, duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function SignupPage() {
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);

  const strength = password.length === 0 ? 0 : password.length < 6 ? 1 : password.length < 10 ? 2 : 3;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1400));
    setLoading(false);
    navigate("/login");
  };

  return (
    <PageTransition>
      <div className="mesh-bg" />

      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div style={{ width: "100%", maxWidth: "440px" }}>

          {/* Logo badge */}
          <motion.div
            custom={0}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            style={{ display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "32px" }}
          >
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "6px 14px",
                borderRadius: "100px",
                border: "1px solid rgba(124,106,255,0.3)",
                background: "rgba(124,106,255,0.08)",
              }}
            >
              <Sparkles size={14} color="#a78bfa" />
              <span
                style={{
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "#a78bfa",
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  fontFamily: "var(--font-display)",
                }}
              >
                Companion
              </span>
            </div>
          </motion.div>

          {/* Card */}
          <motion.div
            custom={1}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="glass-card"
            style={{ borderRadius: "24px", padding: "40px" }}
          >
            <motion.div custom={2} variants={fadeUp} initial="hidden" animate="show" style={{ marginBottom: "32px" }}>
              <h1
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "28px",
                  fontWeight: 700,
                  color: "#f4f4f5",
                  margin: 0,
                  marginBottom: "8px",
                }}
              >
                Create your account
              </h1>
              <p style={{ color: "var(--color-text-muted)", fontSize: "14px", margin: 0 }}>
                Join Companion and start something great
              </p>
            </motion.div>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <motion.div custom={3} variants={fadeUp} initial="hidden" animate="show">
                <InputField
                  id="username"
                  label="Username"
                  type="text"
                  value={username}
                  onChange={setUsername}
                  placeholder="yourname"
                  icon={<User size={15} />}
                  focused={focused}
                  setFocused={setFocused}
                />
              </motion.div>

              <motion.div custom={4} variants={fadeUp} initial="hidden" animate="show">
                <InputField
                  id="email"
                  label="Email"
                  type="email"
                  value={email}
                  onChange={setEmail}
                  placeholder="you@example.com"
                  icon={<Mail size={15} />}
                  focused={focused}
                  setFocused={setFocused}
                />
              </motion.div>

              <motion.div custom={5} variants={fadeUp} initial="hidden" animate="show">
                <InputField
                  id="password"
                  label="Password"
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={setPassword}
                  placeholder="••••••••"
                  icon={<Lock size={15} />}
                  focused={focused}
                  setFocused={setFocused}
                  endAdornment={
                    <button
                      type="button"
                      onClick={() => setShowPass((p) => !p)}
                      style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-text-muted)", padding: 0, display: "flex" }}
                    >
                      {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  }
                />
                {/* Password strength */}
                <AnimatePresence>
                  {password.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      style={{ marginTop: "8px" }}
                    >
                      <div style={{ display: "flex", gap: "4px", marginBottom: "4px" }}>
                        {[1, 2, 3].map((i) => (
                          <motion.div
                            key={i}
                            animate={{
                              background:
                                strength >= i
                                  ? i === 1 ? "#ef4444" : i === 2 ? "#f59e0b" : "#22c55e"
                                  : "rgba(255,255,255,0.06)",
                            }}
                            transition={{ duration: 0.3 }}
                            style={{ flex: 1, height: 3, borderRadius: 2 }}
                          />
                        ))}
                      </div>
                      <p style={{ fontSize: "11px", color: strength === 1 ? "#ef4444" : strength === 2 ? "#f59e0b" : "#22c55e", margin: 0 }}>
                        {strength === 1 ? "Weak" : strength === 2 ? "Medium" : "Strong"} password
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Submit */}
              <motion.div custom={6} variants={fadeUp} initial="hidden" animate="show" style={{ marginTop: "8px" }}>
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02, boxShadow: "0 0 32px rgba(124,106,255,0.4)" }}
                  whileTap={{ scale: 0.98 }}
                  disabled={loading}
                  style={{
                    width: "100%",
                    padding: "14px 24px",
                    borderRadius: "14px",
                    border: "none",
                    background: loading
                      ? "rgba(124,106,255,0.4)"
                      : "linear-gradient(135deg, #7c6aff 0%, #a78bfa 100%)",
                    color: "#fff",
                    fontWeight: 600,
                    fontSize: "15px",
                    cursor: loading ? "not-allowed" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    fontFamily: "var(--font-sans)",
                    letterSpacing: "0.01em",
                  }}
                >
                  <AnimatePresence mode="wait">
                    {loading ? (
                      <motion.div
                        key="spinner"
                        initial={{ opacity: 0, scale: 0.6 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.6 }}
                        style={{
                          width: 18,
                          height: 18,
                          border: "2px solid rgba(255,255,255,0.3)",
                          borderTopColor: "#fff",
                          borderRadius: "50%",
                          animation: "spin 0.7s linear infinite",
                        }}
                      />
                    ) : (
                      <motion.span
                        key="text"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{ display: "flex", alignItems: "center", gap: "8px" }}
                      >
                        Create Account <ArrowRight size={16} />
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>
              </motion.div>
            </form>

            {/* Divider */}
            <motion.div
              custom={7}
              variants={fadeUp}
              initial="hidden"
              animate="show"
              style={{ display: "flex", alignItems: "center", gap: "12px", margin: "28px 0" }}
            >
              <div style={{ flex: 1, height: 1, background: "var(--color-border)" }} />
              <span style={{ fontSize: "12px", color: "var(--color-text-subtle)" }}>or</span>
              <div style={{ flex: 1, height: 1, background: "var(--color-border)" }} />
            </motion.div>

            <motion.p
              custom={8}
              variants={fadeUp}
              initial="hidden"
              animate="show"
              style={{ textAlign: "center", margin: 0, fontSize: "14px", color: "var(--color-text-muted)" }}
            >
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => navigate("/login")}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#a78bfa",
                  fontWeight: 600,
                  fontSize: "14px",
                  padding: 0,
                }}
              >
                Sign in
              </button>
            </motion.p>
          </motion.div>

          <motion.p
            custom={9}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            style={{ textAlign: "center", marginTop: "24px", fontSize: "11px", color: "var(--color-text-subtle)" }}
          >
            By signing up, you agree to our Terms & Privacy Policy
          </motion.p>

        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </PageTransition>
  );
}

interface InputFieldProps {
  id: string;
  label: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  icon: React.ReactNode;
  focused: string | null;
  setFocused: (v: string | null) => void;
  endAdornment?: React.ReactNode;
}

function InputField({ id, label, type, value, onChange, placeholder, icon, focused, setFocused, endAdornment }: InputFieldProps) {
  const isFocused = focused === id;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
      <label
        htmlFor={id}
        style={{ fontSize: "12px", fontWeight: 500, color: "var(--color-text-muted)", letterSpacing: "0.04em" }}
      >
        {label}
      </label>
      <motion.div
        animate={{
          borderColor: isFocused ? "rgba(124,106,255,0.6)" : "var(--color-border)",
          boxShadow: isFocused ? "0 0 0 3px rgba(124,106,255,0.12)" : "none",
        }}
        transition={{ duration: 0.2 }}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          padding: "0 14px",
          borderRadius: "12px",
          border: "1px solid var(--color-border)",
          background: "rgba(255,255,255,0.03)",
          height: "48px",
        }}
      >
        <span style={{ color: isFocused ? "#7c6aff" : "var(--color-text-subtle)", display: "flex", transition: "color 0.2s" }}>
          {icon}
        </span>
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
            color: "var(--color-text)",
            fontSize: "14px",
            fontFamily: "var(--font-sans)",
          }}
        />
        {endAdornment}
      </motion.div>
    </div>
  );
}