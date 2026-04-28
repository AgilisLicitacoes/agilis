function getBaseUrl() {
  const raw = import.meta.env.VITE_API_BASE_URL;
  return typeof raw === "string" ? raw.replace(/\/+$/, "") : "";
}

export async function apiFetch(path, { token, ...init } = {}) {
  const base = getBaseUrl();
  const url = path.startsWith("http") ? path : `${base}${path.startsWith("/") ? "" : "/"}${path}`;

  const headers = new Headers(init.headers ?? {});
  headers.set("content-type", "application/json");
  if (token) headers.set("authorization", `Bearer ${token}`);

  const res = await fetch(url, { ...init, headers });
  const text = await res.text();
  const data = text ? JSON.parse(text) : null;
  if (!res.ok) {
    const err = new Error(data?.error ?? `http_${res.status}`);
    err.status = res.status;
    err.payload = data;
    throw err;
  }
  return data;
}

