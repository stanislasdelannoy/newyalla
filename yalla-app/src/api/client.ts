const API_BASE_URL =
  import.meta.env.VITE_API_URL ?? "http://localhost:8000";

const buildUrl = (path: string) => {
  return `${API_BASE_URL.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
};

// 🔐 Ajout : construit les headers avec le token si présent
function withAuthHeaders(base: HeadersInit = {}): HeadersInit {
  const token = localStorage.getItem("token");

  if (!token) {
    return base;
  }

  return {
    ...base,
    Authorization: `Bearer ${token}`,
  };
}

export async function apiGet<T>(path: string): Promise<T> {
  const response = await fetch(buildUrl(path), {
    method: "GET",
    headers: withAuthHeaders({
      "Content-Type": "application/json",
    }),
    credentials: "include", // tu peux garder pour les cookies plus tard
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(
      `GET ${path} failed: ${response.status} ${response.statusText} - ${text}`,
    );
  }

  return (await response.json()) as T;
}

export async function apiPost<T, B = unknown>(
  path: string,
  body: B,
): Promise<T> {
  const response = await fetch(buildUrl(path), {
    method: "POST",
    headers: withAuthHeaders({
      "Content-Type": "application/json",
    }),
    credentials: "include",
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(
      `POST ${path} failed: ${response.status} ${response.statusText} - ${text}`,
    );
  }

  return (await response.json()) as T;
}

export async function apiPut<T, B = unknown>(
  path: string,
  body: B,
): Promise<T> {
  const response = await fetch(buildUrl(path), {
    method: "PUT",
    headers: withAuthHeaders({
      "Content-Type": "application/json",
    }),
    credentials: "include",
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(
      `PUT ${path} failed: ${response.status} ${response.statusText} - ${text}`,
    );
  }

  return (await response.json()) as T;
}

export async function apiDelete<T = void>(path: string): Promise<T> {
  const response = await fetch(buildUrl(path), {
    method: "DELETE",
    headers: withAuthHeaders({
      "Content-Type": "application/json",
    }),
    credentials: "include",
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(
      `DELETE ${path} failed: ${response.status} ${response.statusText} - ${text}`,
    );
  }

  const text = await response.text();
  return text ? (JSON.parse(text) as T) : (undefined as T);
}
