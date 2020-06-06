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
