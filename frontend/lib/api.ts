const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const response = await fetch(`${API_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`Erro na API: ${response.status}`);
  }

  return response.json();
}

export function getProdutos() {
  return apiRequest("/api/produtos");
}

export function getProdutoPorId(id: string | number) {
  return apiRequest(`/api/produtos/${id}`);
}

export function getCategorias() {
  return apiRequest("/api/categorias");
}

export function login(email: string, senha: string) {
  return apiRequest("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, senha }),
  });
}