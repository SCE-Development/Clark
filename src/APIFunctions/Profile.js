/**
 * Formats the first and last name by making sure the
 * first letter of both are uppercase
 * @param {Object} user - The object contianing all
 *                        of the user data fetched from mangoDB
 * @param {String} user.firstName - The first name of the user
 * @param {String} user.lastName - The last name of the user
 * @returns {String} The string of the users first and last name formated
 */
export function formatFirstAndLastName(user) {
  return (
    user.firstName[0].toUpperCase() +
    user.firstName.slice(1, user.firstName.length) +
    ' ' +
    user.lastName[0].toUpperCase() +
    user.lastName.slice(1, user.lastName.length)
  );
}

/**
 * Gets the appropriate icon text color for the
 * inputed background color
 * @param {String} color - The 6 character hex color code starting with #
 * @returns {String} The hex color of the icon text color
 */
export function getIconTextColor(color) {
  if(typeof color !== 'string') {
    throw new TypeError('color must be a string');
  }
  if(color == '' || color == '#2a323c') {
    return '#FFFFFF';
  }
  // get rgb values 0-255
  const r = parseInt(color.substring(1, 3), 16);
  const g = parseInt(color.substring(3, 5), 16);
  const b = parseInt(color.substring(5, 7), 16);
  // linearize the colors
  const colors = [r / 255.0, g / 255.0, b / 255.0];
  const c = colors.map((color) => {
    if(color <= 0.04045) {
      return color / 12.92;
    }
    return Math.pow(((color + 0.055) / 1.055), 2.4);
  });
  // luminance value
  const L = 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
  // threshold of 0.179
  if(L > 0.179) {
    return '#000000';
  }
  return '#FFFFFF';
}
