
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export async function buscar(endpoint) {
    const response = await fetch(`${API_URL}${endpoint}`);

    if (!response.ok) {
        const erro = await response.text();
        throw new Error(`Erro ao consultar dados: ${response.status} - ${erro}`);
    }

    return response.json();
}

export async function cadastrar(endpoint, dados) {
    const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dados)
    });

    if (!response.ok) {
        const erro = await response.text();
        throw new Error(`Erro ao cadastrar dados: ${response.status} - ${erro}`);
    }

    return response.json();
}

export async function atualizar(endpoint, dados) {
    const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dados)
    });

    if (!response.ok) {
        const erro = await response.text();
        throw new Error(`Erro ao atualizar dados: ${response.status} - ${erro}`);
    }

    if (response.status === 204) {
        return null;
    }

    return response.json();
}
