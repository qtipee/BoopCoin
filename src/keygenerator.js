
const EC = require('elliptic').ec
const ec = new EC('secp256k1') // Elliptic Curve

// Generates a pair of public-private keys

const key = ec.genKeyPair()
const publicKey = key.getPublic('hex')
const privateKey = key.getPrivate('hex')

console.log('\n Private key', privateKey)
console.log('\n Public key', publicKey)
