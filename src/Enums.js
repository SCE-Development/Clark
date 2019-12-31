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

export const officerRole = {
  DEVELOPMENT: 'Development',
  PUBLIC_RELATIONs: 'Public Relations',
  EVENT_PLANNING: 'Event Planning',
  PRINTING: '3D-Printing'
}

export const chairRole = {
  PRESIDENT: 'President',
  VICE_PRESIDENT: 'Vice President',
  TREASURER: 'Treasurer',
  DEVELOPMENT_CHAIR: 'Software Development Chair',
  EVENT_PLANNING_CHAIR: 'Event Planning Chair',
  STORE_MANAGER: 'Store Manager',
  PRINTING_SPECIALIST: '3D-Printing/Hacking Station Chair'
}

export function getKey (enumArray, value) {
  const keys = enumArray.filter(e => e.value === value)
  return keys.length > 0 ? keys[0].key : null
}

export function getValue (enumArray, key) {
  const values = enumArray.filter(e => e.key === key)
  return values.length > 0 ? values[0].value : null
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
