const API_BASE_URL = "http://localhost:3000/api";

async function request(endpoint, options) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
  const contentType = response.headers.get("content-type") || "";
  const payload = contentType.includes("application/json")
    ? await response.json()
    : null;

  if (!response.ok) {
    throw new Error(payload?.message || `Error en la petición: ${response.status}`);
  }

  return payload;
}

export async function apiGet(endpoint) {
  return request(endpoint);
}

export async function apiPost(endpoint, payload) {
  return request(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
}

export async function apiPut(endpoint, payload) {
  return request(endpoint, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
}

export async function apiDelete(endpoint) {
  return request(endpoint, {
    method: "DELETE",
  });
}
