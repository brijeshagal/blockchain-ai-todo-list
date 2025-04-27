"use client";

import api from "@/lib/axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { User, KeyRound, LogIn, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function Signup() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async () => {
    if (!username.trim() || !password.trim()) return;
    
    try {
      setIsLoading(true);
      const res = await api.post("/auth/register", { username, password });
      console.log({ res });
      alert("Signup successful! Please login.");
      router.push("/login");
    } catch (err) {
      console.error("Failed to signup", err);
      alert("Signup failed.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-200 flex items-center justify-center px-4">
      <div className="bg-gray-900 rounded-xl shadow-md p-8 w-full max-w-md border border-gray-800">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold flex items-center justify-center text-white">
            <User size={28} className="mr-2" /> Sign Up
          </h1>
          <p className="text-indigo-300 mt-2">
            Create your account to get started
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Username
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3 py-3 bg-gray-800 border border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-200 pl-10"
              />
              <User size={18} className="absolute left-3 top-3.5 text-gray-400" />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                placeholder="Create a strong password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-3 bg-gray-800 border border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-200 pl-10"
              />
              <KeyRound size={18} className="absolute left-3 top-3.5 text-gray-400" />
            </div>
          </div>

          <button
            onClick={handleSignup}
            disabled={isLoading || !username.trim() || !password.trim()}
            className="w-full flex items-center justify-center px-4 py-3 bg-indigo-700 text-white rounded-md hover:bg-indigo-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
            ) : (
              <>
                <LogIn size={18} className="mr-2" /> Create Account
              </>
            )}
          </button>

          <div className="text-center text-gray-400 border-t border-gray-800 pt-6">
            <p>
              Already have an account?{" "}
              <Link 
                href="/login" 
                className="text-indigo-400 hover:text-indigo-300 transition flex items-center justify-center mt-2"
              >
                Log in <ArrowRight size={16} className="ml-1" />
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}