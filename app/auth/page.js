"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function AuthPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "job_seeker", // Default role
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleRoleChange = (role) => {
    setFormData((prevData) => ({
      ...prevData,
      role: role,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    if (!isLogin && formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      setIsSubmitting(false);
      return;
    }

    const apiEndpoint = isLogin ? "/api/login" : "/api/signup";

    try {
      const res = await fetch(apiEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong!");
        setIsSubmitting(false);
        return;
      }

      // Success handling
      if (isLogin) {
        const role = data.role;
        switch (role) {
          case "job_seeker":
            router.push("/dashboard/job-seeker");
            break;
          case "employer":
            router.push("/dashboard/employer");
            break;
          case "admin":
            router.push("/dashboard/admin");
            break;
          default:
            router.push("/");
        }
      } else {
        setIsLogin(true);
        setFormData({
          ...formData,
          password: "",
          confirmPassword: "",
        });
      }
    } catch (error) {
      console.error("Auth Error:", error);
      setError("Server error. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Clear error when switching between login/signup
  useEffect(() => {
    setError("");
  }, [isLogin]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-2xl overflow-hidden border border-gray-700"
      >
        <div className="p-8">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <h2 className="text-3xl font-bold text-white">
                {isLogin ? "Welcome Back" : "Create Account"}
              </h2>
              <motion.div
                layoutId="underline"
                className="absolute bottom-0 left-0 w-full h-1 bg-blue-500"
                initial={false}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            </div>
          </div>

          <AnimatePresence mode="wait">
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-red-400 text-center mb-4 p-3 bg-red-900/30 rounded-lg"
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400 transition"
                  placeholder="John Doe"
                  required
                />
              </motion.div>
            )}

            {/* Role selection - now visible in both login and signup */}
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: isLogin ? 0.1 : 0.15 }}
            >
              <label className="block text-sm font-medium text-gray-300 mb-2">
                I am a:
              </label>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => handleRoleChange("job_seeker")}
                  className={`flex-1 py-2 px-4 rounded-lg border transition flex items-center justify-center gap-2 ${
                    formData.role === "job_seeker"
                      ? "bg-blue-600/30 border-blue-500 text-white"
                      : "bg-gray-700/50 border-gray-600 text-gray-300"
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  Job Seeker
                </button>
                <button
                  type="button"
                  onClick={() => handleRoleChange("employer")}
                  className={`flex-1 py-2 px-4 rounded-lg border transition flex items-center justify-center gap-2 ${
                    formData.role === "employer"
                      ? "bg-blue-600/30 border-blue-500 text-white"
                      : "bg-gray-700/50 border-gray-600 text-gray-300"
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  Employer
                </button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: isLogin ? 0.2 : 0.2 }}
            >
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400 transition"
                placeholder="your@email.com"
                required
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: isLogin ? 0.3 : 0.3 }}
            >
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400 transition"
                placeholder="••••••••"
                required
              />
            </motion.div>

            {!isLogin && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400 transition"
                  placeholder="••••••••"
                  required
                />
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: isLogin ? 0.4 : 0.5 }}
            >
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-3 px-4 rounded-lg font-medium text-white transition ${
                  isSubmitting
                    ? "bg-blue-700 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                } flex items-center justify-center`}
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Processing...
                  </>
                ) : isLogin ? (
                  "Login"
                ) : (
                  "Create Account"
                )}
              </button>
            </motion.div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400">
              {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-blue-400 hover:text-blue-300 font-medium transition"
              >
                {isLogin ? "Sign up" : "Sign in"}
              </button>
            </p>
          </div>
        </div>

        {!isLogin && (
          <div className="bg-gray-900/50 p-4 text-center text-sm text-gray-400">
            By creating an account, you agree to our{" "}
            <a href="#" className="text-blue-400 hover:underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-blue-400 hover:underline">
              Privacy Policy
            </a>
            .
          </div>
        )}
      </motion.div>
    </div>
  );
}