// src/api/auth.ts

export type LoginPayload = {
  email: string;
  password: string;
};

export type TokenResponse = {
  access_token: string;
  token_type: string;
};

const API_URL = "http://localhost:8000"; // adapte si besoin

export async function login(payload: LoginPayload): Promise<TokenResponse> {
  const res = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.detail ?? "Login failed");
  }

  return res.json();
}

export type RegisterPayload = {
  email: string;
  password: string;
};

export async function register(payload: RegisterPayload): Promise<void> {
  const res = await fetch(`${API_URL}/api/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.detail ?? "Register failed");
  }
}
