// Thin wrapper over fetch for the NestJS API: base URL, bearer token, and
// turning the server's error payload into a plain Error the UI already knows
// how to display.

export const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:3000"
).replace(/\/$/, "");

const TOKEN_KEY = "proDashboard.token";

export function getToken() {
  try {
    return window.localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setToken(token) {
  try {
    if (token) window.localStorage.setItem(TOKEN_KEY, token);
    else window.localStorage.removeItem(TOKEN_KEY);
  } catch {
    // Private mode or blocked storage: the session simply won't survive a
    // reload, which is better than failing the login outright.
  }
}

export function clearToken() {
  setToken(null);
}

// Nest's ValidationPipe returns `message` as an array of problems; everything
// else returns a single string.
function readErrorMessage(payload, status) {
  const message = payload?.message;

  if (Array.isArray(message) && message.length) return message.join(", ");
  if (typeof message === "string" && message) return message;
  if (typeof payload?.error === "string" && payload.error) return payload.error;

  if (status === 0)
    return "Cannot reach the API. Is the server running on " + API_URL + "?";

  return `Request failed with status ${status}`;
}

export async function request(
  path,
  { method = "GET", body, auth = true, raw = false } = {}
) {
  const headers = {};
  const token = auth ? getToken() : null;

  if (token) headers.Authorization = `Bearer ${token}`;

  let payload = body;
  // FormData sets its own multipart boundary, so never set Content-Type here.
  if (body !== undefined && !(body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
    payload = JSON.stringify(body);
  }

  let response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      method,
      headers,
      body: payload,
    });
  } catch {
    throw new Error(readErrorMessage(null, 0));
  }

  if (response.status === 204) return null;

  const text = await response.text();
  let data = null;

  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }

  if (!response.ok) {
    const error = new Error(readErrorMessage(data, response.status));
    error.status = response.status;
    throw error;
  }

  return raw ? response : data;
}

export const api = {
  get: (path, options) => request(path, { ...options, method: "GET" }),
  post: (path, body, options) => request(path, { ...options, method: "POST", body }),
  patch: (path, body, options) => request(path, { ...options, method: "PATCH", body }),
  delete: (path, options) => request(path, { ...options, method: "DELETE" }),
};

// Shared by the forms that send a file alongside ordinary fields.
export function toFormData(fields) {
  const form = new FormData();

  Object.entries(fields).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    form.append(key, value instanceof File ? value : String(value));
  });

  return form;
}
