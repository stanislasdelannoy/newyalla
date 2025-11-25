const API_BASE_URL =
  import.meta.env.VITE_API_URL ?? "http://localhost:8000";

const buildUrl = (path: string) => {
  return `${API_BASE_URL.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
};

export async function apiGet<T>(path: string): Promise<T> {
  const response = await fetch(buildUrl(path), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", // utile plus tard si tu utilises des cookies/session
  });

  if (!response.ok) {
    // tu peux améliorer ça plus tard (gestion d’erreurs globale)
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
    headers: {
      "Content-Type": "application/json",
    },
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
    headers: {
      "Content-Type": "application/json",
    },
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
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(
      `DELETE ${path} failed: ${response.status} ${response.statusText} - ${text}`,
    );
  }

  // certains DELETE ne renvoient rien
  const text = await response.text();
  return (text ? (JSON.parse(text) as T) : (undefined as T));
}
