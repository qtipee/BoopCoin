
const crypto = require('crypto')
const EC = require('elliptic').ec
const ec = new EC('secp256k1') // Elliptic Curve

// Represents a transaction ; two wallet addresses, an amount and a timestamp
class Transaction
{
    constructor(fromAddress, toAddress, amount)
    {
        this.fromAddress = fromAddress
        this.toAddress = toAddress
        this.amount = amount
        this.timestamp = Date.now()
    }

    calculateHash()
    {
        return crypto.createHash('sha256').update(
                this.fromAddress +
                this.toAddress +
                this.amount +
                this.timestamp
            ).digest('hex')
    }

    signTransaction(signingKey)
    {
        if (signingKey.getPublic('hex') !== this.fromAddress)
        {
            throw new Error('You cannot sign transactions for other wallets !')
        }

        const hashTx = this.calculateHash()
        const sig = signingKey.sign(hashTx, 'base64')
        
        this.signature = sig.toDER('hex')
    }

    isValid()
    {
        if (this.fromAddress === null) return true
        
        if (! this.signature || this.signature.length === 0)
        {
            throw new Error('No signature in this transaction !')
        }

        const publicKey = ec.keyFromPublic(this.fromAddress, 'hex')

        return publicKey.verify(this.calculateHash(), this.signature)
    }
}

// A block contains some transactions, its hash and the previous block hash
class Block
{
    constructor(timestamp, transactions, previousHash = '')
    {
        this.timestamp = timestamp
        this.transactions = transactions
        this.previousHash = previousHash
        this.nonce = 0
        this.hash = this.calculateHash()
    }

    calculateHash()
    {
        return crypto.createHash('sha256').update(
                this.previousHash +
                this.timestamp +
                JSON.stringify(this.transactions)
                + this.nonce
            ).digest('hex')
    }

    mineBlock(difficulty)
    {
        // Adds a certain number of zeros in front of the hash
        while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join('0'))
        {
            this.nonce++
            this.hash = this.calculateHash()
        }

        console.log('Block mined', this.hash)
    }

    hasValidTransactions()
    {
        for (const tx of this.transactions)
        {
            if (! tx.isValid()) return false
        }
        return true
    }
}

// A blockchain contains mined blocks
class Blockchain
{
    constructor()
    {
        this.chain = [this._createGenesisBlock()]
        this.difficulty = 2 // proof of work difficulty
        this.pendingTransactions = []
        this.miningReward = 100
    }

    _createGenesisBlock()
    {
        return new Block(Date.now(), 'Genesis Block', '0')
    }

    getLatestBlock()
    {
        return this.chain[this.chain.length - 1]
    }

    minePendingTransactions(miningRewardAddress)
    {
        // In reality, we cannot pass all the pending transactions (too large) ; we have to pick some
        let block = new Block(Date.now(), this.pendingTransactions, this.getLatestBlock().hash)
        block.mineBlock(this.difficulty)

        console.log('Block successfully mined !')
        this.chain.push(block)

        // Resets the pending transactions
        this.pendingTransactions = [
            //new Transaction(null, miningRewardAddress, this.miningReward)
        ]
    }

    addTransaction(transaction)
    {
        if (! transaction.fromAddress || ! transaction.toAddress)
        {
            throw new Error('Transaction must include from and to addresses !')
        }

        if (! transaction.isValid())
        {
            throw new Error('Cannot add invalid transaction to chain !')
        }

        this.pendingTransactions.push(transaction)
    }

    getBalanceOfAddress(address)
    {
        let balance = 0

        for (const block of this.chain)
        {
            for (const trans of block.transactions)
            {
                if (trans.fromAddress === address)
                {
                    balance -= trans.amount
                }

                if (trans.toAddress === address)
                {
                    balance += trans.amount
                }
            }
        }

        return balance
    }

    isChainValid()
    {
        for (let i = 1; i < this.chain.length; i++)
        {
            const currentBlock = this.chain[i]
            const previousBlock = this.chain[i - 1]

            if (! currentBlock.hasValidTransactions()) return false
            
            if (currentBlock.hash !== currentBlock.calculateHash()) return false
            
            if (currentBlock.previousHash !== previousBlock.hash) return false
        }

        return true
    }

    print()
    {
        console.log(JSON.stringify(this, null, 4))
    }
}

module.exports.Blockchain = Blockchain
module.exports.Transaction = Transaction
