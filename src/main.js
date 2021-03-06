
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

console.log('\n Starting the miner...')
boopCoin.minePendingTransactions(myWalletAddress)
console.log('\n My balance', boopCoin.getBalanceOfAddress(myWalletAddress))
console.log('\n Is blockchain valid ?', boopCoin.isChainValid())

// Altering the blockchain
console.log('\n Altering the blockchain...')
boopCoin.chain[1].transactions[0].amount = 1
console.log('Is blockchain valid ?', boopCoin.isChainValid())
