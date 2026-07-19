import axios, { AxiosError, type AxiosRequestConfig } from "axios";
import { supabase } from "@/lib/supabase/client";

// Default to a same-origin, relative base (`/api/v1`). In production the browser
// hits `https://<vercel-domain>/api/*`, which Vercel — and `next dev` locally —
// rewrites to the Railway backend (see `rewrites()` in next.config.ts). Railway
// is never called directly, so ISPs that fail to resolve *.up.railway.app can't
// break the app. Set NEXT_PUBLIC_API_URL to an ABSOLUTE url only to bypass the
// proxy and hit a backend directly (e.g. a local API during development).
const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "";

export const api = axios.create({
  baseURL: `${apiUrl}/api/v1`,
  timeout: 15_000,
  headers: { "Content-Type": "application/json" },
});

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

type RetryConfig = AxiosRequestConfig & { _retry?: boolean };

api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const original = error.config as RetryConfig | undefined;
    if (
      error.response?.status === 401 &&
      original &&
      !original._retry &&
      typeof window !== "undefined"
    ) {
      original._retry = true;
      const { data, error: refreshErr } = await supabase().auth.refreshSession();
      if (refreshErr || !data.session) {
        await supabase().auth.signOut();
        return Promise.reject(error);
      }
      original.headers = {
        ...(original.headers ?? {}),
        Authorization: `Bearer ${data.session.access_token}`,
      };
      return api.request(original);
    }
    return Promise.reject(error);
  },
);
