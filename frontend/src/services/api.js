const BASE = '/api'

async function safeFetch(path, options) {
  try {
    const res = await fetch(`${BASE}${path}`, options)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return await res.json()
  } catch (err) {
    console.warn(`API offline, using mock for ${path}`)
    const { mockResponse } = await import('../data/mockData.js')
    return mockResponse(path, options)
  }
}

export const api = {
  teams: () => safeFetch('/teams'),
  team: (id) => safeFetch(`/teams/${id}`),
  players: (sortBy = 'rating') => safeFetch(`/players?sort_by=${sortBy}`),
  player: (id) => safeFetch(`/players/${id}`),
  matches: () => safeFetch('/matches'),
  match: (id) => safeFetch(`/matches/${id}`),
  recommendations: (limit = 5) => safeFetch(`/recommendations?limit=${limit}`),
  summary: () => safeFetch('/stats/summary'),
  predict: (home, away, stage = 'Group A') =>
    safeFetch('/predict', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ home, away, stage }),
    }),
}
