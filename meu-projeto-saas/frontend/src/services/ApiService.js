class ApiService {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }

  _getHeaders() {
    const token = localStorage.getItem('saas_user_token');
    return {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    };
  }

  async get(endpoint) {
    const resposta = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'GET',
      headers: this._getHeaders()
    });
    return resposta.json();
  }

  async post(endpoint, dados) {
    const resposta = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers: this._getHeaders(),
      body: JSON.stringify(dados)
    });
    return resposta;
  }

  async put(endpoint, dados) {
    const resposta = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'PUT',
      headers: this._getHeaders(),
      body: JSON.stringify(dados)
    });
    return resposta;
  }

  async delete(endpoint) {
    const resposta = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'DELETE',
      headers: this._getHeaders()
    });
    return resposta;
  }
}

// Cria a instância global unificada compartilhada
const apiService = new ApiService('http://localhost:3000');
