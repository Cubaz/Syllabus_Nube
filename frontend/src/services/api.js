const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

async function request(endpoint, options) {
  let response;
  try {
    response = await fetch(`${API_BASE_URL}${endpoint}`, options);
  } catch {
    throw new Error("No se pudo conectar con el servidor. Verifica que el backend esté en ejecución.");
  }

  const contentType = response.headers.get("content-type") || "";
  const payload = contentType.includes("application/json")
    ? await response.json().catch(() => null)
    : null;

  if (!response.ok) {
    throw new Error(payload?.message || `Error en la petición: ${response.status}`);
  }

  return payload;
}

const sendJson = (method) => (endpoint, payload) =>
  request(endpoint, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

export const apiGet = (endpoint) => request(endpoint);
export const apiPost = sendJson("POST");
export const apiPut = sendJson("PUT");
export const apiDelete = (endpoint) => request(endpoint, { method: "DELETE" });
