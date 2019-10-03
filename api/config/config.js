// Copy the contents of this file into a config.js in this same directory

module.exports = {
  // secretKey is used to generate a unique jwtToken
  // This key should be changed from it's default to a mix of
  // random characters, numbers and symbols. At least 25 characters long
  // To generate a random key, visit https://www.lastpass.com/password-generator
  secretKey: 'E5mwTj#J6!yeMQ0jvlOg&q$vJSCjyDiDXQx0Dz^cRCSaH9!hNa',

  // Sets the required strength. Default is 'strong'
  // strong:
  // Contains at least 1 lowercase alphabetical character
  // Contains at least 1 uppercase alphabetical character
  // Contain at least 1 numeric character
  // Contain at least one special character: !@#\$%\^&
  // The string must be at least eight characters or longer

  // medium:
  // Contains at least 1 lowercase alphabetical character and
  // at least 1 uppercase alphabetical character or
  // contains at least one lowercase alphabetical character and
  // at least 1 numeric character or
  // contains at least one uppercase alphabetical character and
  // at least 1 numeric character
  // The string must be at least six characters or longer

  // weak:
  // Unrestricted passwords allowed
  passwordStrength: 'weak'
}
