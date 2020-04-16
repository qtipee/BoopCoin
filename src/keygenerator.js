
const EC = require('elliptic').ec
// Elliptic Curve
const ec = new EC('secp256k1')

const key = ec.genKeyPair()
const publicKey = key.getPublic('hex')
const privateKey = key.getPrivate('hex')

console.log('\n Private key', privateKey)
console.log('\n Public key', publicKey)
