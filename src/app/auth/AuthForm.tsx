"use client";

import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import Link from "next/link";

type AuthFormProps = {
  mode: "signup" | "signin";
};

export default function AuthForm({ mode }: AuthFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { handleAuth } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleAuth(mode, email, password);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white p-6 rounded-lg shadow-md"
      >
        <h1 className="text-xl font-bold mb-4 text-center">
          {mode === "signup" ? "Sign Up" : "Sign In"}
        </h1>
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium mb-1">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
        >
          {mode === "signup" ? "Sign Up" : "Sign In"}
        </button>
      </form>

      <p className="mt-4 text-sm text-gray-600">
        {mode === "signup" ? (
          <>
            Already have an account?{" "}
            <Link href="/auth/signin" className="text-blue-500 hover:underline">
              Sign In
            </Link>
          </>
        ) : (
          <>
            Don't have an account?{" "}
            <Link href="/auth/signup" className="text-blue-500 hover:underline">
              Sign Up
            </Link>
          </>
        )}
      </p>
    </div>
  );
}
