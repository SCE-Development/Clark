/**
 * Sanitizes a string by removing all non-alphanumeric characters.
 * This includes symbols, punctuation, and whitespace.
 *
 * @param {string} string - The input string to sanitize.
 * @returns {string} A cleaned string containing only letters and numbers.
 */
export function cleanStr(string) {
  return string.replace(/[^a-zA-Z0-9]/g, '');
}
