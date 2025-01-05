"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export function useAuth() {
  const [error, setError] = useState<string | null>(null);

  const handleAuth = async (
    mode: "signup" | "signin",
    email: string,
    password: string
  ) => {
    setError(null);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unknown error occurred");
      }
    }
  };

  return { handleAuth, error };
}
