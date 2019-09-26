'use strict'

// Constants
const certificateDir = 'trustStore' // the default folder storing the keys and certs below, relative to the current directory
const privateKeyName = process.env.PRIVATE_KEY_NAME // the name of your private rsa key (for ssl/https)
const publicKeyName = process.env.PUBLIC_KEY_NAME // the name of your public rsa key (for ssl/https)
const certName = process.env.CERTIFICATE // the name of your ca certificate (for ssl/https)
const passphrase = process.env.PASSPHRASE // your rsa passphrase (for ssl/https)

// Container (Singleton)
const security = {
  prvkey: `${__dirname}/${certificateDir}/${privateKeyName}`,
  pubkey: `${__dirname}/${certificateDir}/${publicKeyName}`,
  passphrase: passphrase,
  cert: `${__dirname}/${certificateDir}/${certName}`
}
Object.freeze(security)

module.exports = security
