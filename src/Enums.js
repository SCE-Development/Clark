export const eventModalState = {
  SUBMIT: 0,
  EDIT: 1
}

export const memberApplicationState = {
  SELECT_MEMBERSHIP_PLAN: 0,
  FORM_INFO: 1,
  CONFIRMATION: 2
}

export const membershipPlans = {
  YEAR: 1,
  SEMESTER: 2
}

export function memberShipPlanToString (key) {
  let str = ''
  if (key === membershipPlans.YEAR) {
    str = 'Spring and Fall 2020'
  } else if (key === membershipPlans.SEMESTER) {
    str = 'Spring 2020'
  }
  return str
}

export const membershipStatus = [
  { key: 'Ban', value: -2 },
  { key: 'Pending', value: -1 },
  { key: 'Member', value: 0 },
  { key: 'Officer', value: 1 },
  { key: 'Admin', value: 2 }
]

export function getKey (enumArray, value) {
  return enumArray.filter(e => e.value === value)[0].key
}

export function getValue (enumArray, key) {
  return enumArray.filter(e => e.key === key)[0].value
}

export function getAllKeys (enumArray) {
  const array = []
  enumArray.forEach(e => {
    array.push(e.key)
  })
  return array
}

export function getAllValues (enumArray) {
  const array = []
  enumArray.forEach(e => {
    array.push(e.value)
  })
  return array
}
