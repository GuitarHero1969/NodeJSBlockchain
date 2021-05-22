const Block = require('./block');

class Blockchain {
    constructor() {
        this.chain = [Block.genesis()];
    }

    /** Blockchain: index Allow users to add blocks to the chain. */
    addBlock(data) {
        const block = Block.mineBlock(this.chain[this.chain.length - 1], data);
        this.chain.push(block);

        return block;
    }

    /** Validation which also support multiple contributors to the chain. */
    isValidChain(chain) {

        // compare the first element of the incoming chain
        // in JS, two different objects that are not referencing the same original object
        // cannot be equal to each other
        if (JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())) {
            return false;
        }

        for (let i = 1; i < chain.length; i++) {

            const block = chain[i]; // first, second, third...
            const lastBlock = chain[i - 1]; // 0, 1, 2, 3, ...
            
            // [i - 1] - if we are at the first position, this last block will be the genesis block
            // if we are at the second block, the last block will be the first block

            // the current block's last hash must match the hash of the last block
            // the last block's hash must match 
            if (block.lastHash !== lastBlock.hash || block.hash !== Block.blockHash(block)) {
                return false;
            }
        }

        return true;
    }

    /** Use the received chain to synchronize chains across all instances. */
    replaceChain(newChain) {

        // if the chains are the same length, it is likely that they are the same chain!
        // the received chain must be longer than the current chain to prevent forking and version problems across nodes
        if (newChain.length <= this.chain.length) {
            console.log('replaceChain(newChain): Received chain is equal to or less than the length of the current chain!');
            return;
        } else if (!this.isValidChain(newChain)) {
            console.log('replaceChain(newChain): The received chain is invalid!');
            return;
        }

        console.log('replaceChain(newChain): Replacing blockchain with the new chain...');
        this.chain = newChain;
    }
}

module.exports = Blockchain;