"use client";

import { useState } from "react";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState("");

  async function handleGenerate() {
    let email = localStorage.getItem("userEmail");

    if (!email) {
      email = window.prompt("Enter your email:");

      if (!email) {
        alert("Email is required");
        return;
      }

      localStorage.setItem("userEmail", email);
    }

    const res = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt, email }),
    });

    const data = await res.json();

    if (data.error) {
      const checkout = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      const checkoutData = await checkout.json();
      window.location.href = checkoutData.url;
      return;
    }

    setResult(data.result);
  }

  return (
    <div style={{ padding: "40px" }}>
      <h1>AI Script Generator</h1>

      <input
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Enter your idea..."
        style={{ width: "300px", padding: "10px" }}
      />

      <br /><br />

      <button onClick={handleGenerate}>
        Generate
      </button>

      <br /><br />

      <pre>{result}</pre>
    </div>
  );
}
