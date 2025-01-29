"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignupPage() {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const res = await fetch("/api/user/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      alert("Signup successful! Redirecting to login...");
      router.push("/login");
    } else {
      const data = await res.json();
      setError(data.error || "Something went wrong.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-2xl mb-4">Signup</h1>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md">
        <input type="text" name="name" placeholder="Name" onChange={handleChange} className="border p-2 w-full mb-2" required />
        <input type="email" name="email" placeholder="Email" onChange={handleChange} className="border p-2 w-full mb-2" required />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} className="border p-2 w-full mb-2" required />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded w-full">Signup</button>
      </form>
      <p className="mt-4">Already have an account? <a href="/login" className="text-blue-500">Login</a></p>
    </div>
  );
}