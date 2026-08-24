import staticDemo from '../static-demo.json'

let cache = null

export async function getStaticDemo() {
  if (!cache) cache = staticDemo
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
