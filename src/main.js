
const { Blockchain, Transaction } = require('./blockchain')

const EC = require('elliptic').ec
// Elliptic Curve
const ec = new EC('secp256k1')

const myKey = ec.keyFromPrivate('45fbdae93711c01777df1d4ceb2f0c78f0582bfbccfd738af044f209bec8d1b8')
const myWalletAddress = myKey.getPublic('hex')

let boopCoin = new Blockchain()

const tx1 = new Transaction(myWalletAddress, 'public key goes here', 10)
tx1.signTransaction(myKey)
boopCoin.addTransaction(tx1)

console.log('\n Starting the miner.')
boopCoin.minePendingTransactions(myWalletAddress)
console.log('\n My balance', boopCoin.getBalanceOfAddress(myWalletAddress))

console.log('Is blockchain valid ?', boopCoin.isChainValid())

boopCoin.chain[1].transactions[0].amount = 1
console.log('Is blockchain valid ?', boopCoin.isChainValid())

// A reward is only given when the next block is mined
/*
console.log('\n Starting the miner again.')
boopCoin.minePendingTransactions(myWalletAddress)
console.log('\n My balance', boopCoin.getBalanceOfAddress(myWalletAddress))
*/

/*
console.log('Mining block 1...')
boopCoin.addBlock(new Block(1, Date.now(), { amount: 4 }))
console.log('Mining block 2...')
boopCoin.addBlock(new Block(2, Date.now(), { amount: 10 }))
console.log('Mining block 3...')
boopCoin.addBlock(new Block(3, Date.now(), { amount: 21 }))

*/
/*
boopCoin.print()
console.log('Is blockchain valid ?', boopCoin.isChainValid())

// We alter a block transactions
boopCoin.chain[1].transactions = { amount: 100 }
// We update this block hash
boopCoin.chain[1].hash = boopCoin.chain[1].calculateHash()
// It does not work, because the next block has this block previous hash
console.log('Is blockchain valid ?', boopCoin.isChainValid())
*/
