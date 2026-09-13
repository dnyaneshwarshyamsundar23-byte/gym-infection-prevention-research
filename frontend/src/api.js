const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8000/api";

async function request(endpoint, options = {}) {
  const token = localStorage.getItem("token");

  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  let response;

  try {
    response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });
  } catch {
    throw new Error(
      "Cannot connect to the research server. Please make sure FastAPI is running on port 8000."
    );
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.detail || "Something went wrong.");
  }

  return data;
}

export const api = {
  signup(data) {
    return request("/auth/signup", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  login(data) {
    return request("/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  getMe() {
    return request("/me");
  },

  completePretest() {
    return request("/research/pretest-complete", {
      method: "POST",
    });
  },

  completeModule(moduleNumber) {
    return request(`/research/module/${moduleNumber}`, {
      method: "POST",
    });
  },

  completePosttest() {
    return request("/research/posttest-complete", {
      method: "POST",
    });
  },
};
