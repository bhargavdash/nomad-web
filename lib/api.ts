import axios from "axios";
import { supabase } from "@/lib/supabase/client";

const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

export const api = axios.create({
  baseURL: `${apiUrl}/api/v1`,
  timeout: 15_000,
  headers: { "Content-Type": "application/json" },
});

// Inject Supabase access token on every request.
api.interceptors.request.use(async (config) => {
  if (typeof window !== "undefined") {
    const { data } = await supabase().auth.getSession();
    const token = data.session?.access_token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});
