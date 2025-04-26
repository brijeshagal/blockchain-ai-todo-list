"use client";

import api from "@/lib/axios";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Login() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const res = await api.post("/auth/login", { username, password });
      await localStorage.setItem("token", res.data.token);
      router.push("/");
    } catch (err) {
      console.error("Failed to login", err);
      alert("Login failed. Check credentials!");
      // router.push("/");
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "auto", padding: 16 }}>
      <h1>🔐 Login</h1>

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
      <button onClick={handleLogin} style={{ width: "100%", padding: 10 }}>
        Login
      </button>

      <p style={{ marginTop: 16 }}>
        Don&apos;t have an account?{" "}
        <a href="/signup" style={{ color: "blue" }}>
          Sign up
        </a>
      </p>
    </div>
  );
}
