import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Loader2, ShieldCheck, ShieldX } from "lucide-react";
import { api } from "../../../shared/api";

type Status = "verifying" | "success" | "error";

// Landing target for the magic-link emails (FRONTEND_URL/auth/verify?token=...).
export default function VerifyMagicLinkPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<Status>("verifying");
  const [message, setMessage] = useState("Verifying your sign-in link...");
  // React StrictMode mounts twice in dev; the token is single-use, so guard.
  const attempted = useRef(false);

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      setStatus("error");
      setMessage("This link is missing its sign-in token.");
      return;
    }

    if (attempted.current) return;
    attempted.current = true;

    api
      .post("/auth/verify-magic-link", { token })
      .then((response) => {
        localStorage.setItem("token", response.data.access_token);
        setStatus("success");
        setMessage("You're signed in. Taking you to your dashboard...");
        setTimeout(() => navigate("/dashboard"), 1200);
      })
      .catch((err) => {
        setStatus("error");
        setMessage(
          err?.response?.data?.detail ??
            "This link is invalid or has expired. Request a new one from the login page."
        );
      });
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen bg-[#070712] text-white flex items-center justify-center p-8">
      <div className="bg-[#0c0d1a]/80 border border-white/5 rounded-[24px] p-10 max-w-md w-full text-center">
        <div className="flex justify-center mb-6">
          {status === "verifying" && (
            <Loader2 size={40} className="text-indigo-400 animate-spin" />
          )}
          {status === "success" && (
            <ShieldCheck size={40} className="text-emerald-400" />
          )}
          {status === "error" && <ShieldX size={40} className="text-rose-400" />}
        </div>

        <h1 className="text-xl font-bold mb-2">
          {status === "verifying" && "Signing you in"}
          {status === "success" && "Welcome back"}
          {status === "error" && "Link problem"}
        </h1>
        <p className="text-sm text-gray-400 leading-relaxed">{message}</p>

        {status === "error" && (
          <Link
            to="/login"
            className="inline-block mt-6 bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl text-sm font-semibold transition"
          >
            Back to login
          </Link>
        )}
      </div>
    </div>
  );
}
