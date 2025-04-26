"use client";

import api from "@/lib/axios";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Signup() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async () => {
    try {
      const res = await api.post("/auth/register", { username, password });
      console.log({ res });
      alert("Signup successful! Please login.");
      router.push("/login");
    } catch (err) {
      console.error("Failed to signup", err);
      alert("Signup failed.");
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "auto", padding: 16 }}>
      <h1>🆕 Signup</h1>

      <input
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        style={{ width: "100%", marginBottom: 8, padding: 8 }}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ width: "100%", marginBottom: 16, padding: 8 }}
      />
      <button onClick={handleSignup} style={{ width: "100%", padding: 10 }}>
        Sign Up
      </button>

      <p style={{ marginTop: 16 }}>
        Already have an account?{" "}
        <a href="/login" style={{ color: "blue" }}>
          Login
        </a>
      </p>
    </div>
  );
}
