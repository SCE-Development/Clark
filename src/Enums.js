export const membershipStatus = [
  { key: 'Ban', value: -2 },
  { key: 'Pending', value: -1 },
  { key: 'Member', value: 0 },
  { key: 'Officer', value: 1 },
  { key: 'Admin', value: 2 }
]

export function getKey (enums, value) {
  return enums.filter(e => e.value === value)[0].key
}

export function getValue (enums, key) {
  return enums.filter(e => e.key === key)[0].value
}
