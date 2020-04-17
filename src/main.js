
const { Blockchain, Transaction } = require('./blockchain')
const EC = require('elliptic').ec
const ec = new EC('secp256k1') // Elliptic Curve

const myKey = ec.keyFromPrivate('45fbdae93711c01777df1d4ceb2f0c78f0582bfbccfd738af044f209bec8d1b8')
const myWalletAddress = myKey.getPublic('hex')

let boopCoin = new Blockchain()

// Adds a transaction to the blockchain
const tx1 = new Transaction(myWalletAddress, 'public key goes here', 10)
tx1.signTransaction(myKey)
boopCoin.addTransaction(tx1)
console.log('Mining block 1...')
boopCoin.minePendingTransactions(myWalletAddress)

const tx2 = new Transaction(myWalletAddress, 'public key goes here', 20)
tx2.signTransaction(myKey)
boopCoin.addTransaction(tx2)
console.log('Mining block 2...')
boopCoin.minePendingTransactions(myWalletAddress)

const tx3 = new Transaction(myWalletAddress, 'public key goes here', 30)
tx3.signTransaction(myKey)
boopCoin.addTransaction(tx3)
console.log('Mining block 3...')
boopCoin.minePendingTransactions(myWalletAddress)
