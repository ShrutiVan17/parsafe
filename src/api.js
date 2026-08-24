const API_URL = import.meta.env.VITE_API_URL || ''

async function request(path, options = {}) {
  if (!API_URL) throw new Error('API URL not configured')

  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  })

  if (!response.ok) throw new Error(`API request failed: ${response.status}`)
  return response.json()
}

export function getStats() {
  return request('/stats')
}

export function rankParking(preferences) {
  return request('/rank', {
    method: 'POST',
    body: JSON.stringify(preferences),
  })
}

export function askParSafe(query) {
  return request('/ask', {
    method: 'POST',
    body: JSON.stringify({ query }),
  })
}
