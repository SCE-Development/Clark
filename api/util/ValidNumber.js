// checks value and returns true or false depending on if it's a valid number

const isValidNumber = (value) => {
  return !Number.isNaN(Number(value));
}

module.exports = { isValidNumber };
