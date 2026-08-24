let cache = null

export async function getStaticDemo() {
  if (cache) return cache

  const response = await fetch(
    `${import.meta.env.BASE_URL}static-demo.json`
  )

  if (!response.ok) {
    throw new Error('Static demo data unavailable')
  }

  cache = await response.json()
  return cache
}

export function rankingKey(preferences) {
  return [
    preferences.maxWalk,
    preferences.risk,
    preferences.occupancy,
    preferences.type,
  ].join('|')
}
