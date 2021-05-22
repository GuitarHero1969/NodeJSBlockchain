// access to the Block class
const Block = require('./block');

// jest function: 'describe' first parameter is a string that serves as a test description
// the second parameter is a call-back arrow function which will contain
// a series of tests, that jest will execute once it finds this overall 'describe' block function
// beforeEach allows us to run the same code for each of the following unit tests.

// to run the tests using jest.js in the command line: 

describe('Block', () => {

    let data, lastBlock, block;

    beforeEach(() => {
        data = 'bar';
        lastBlock = Block.genesis();
        block = Block.mineBlock(lastBlock, data);
    });

    it('sets the `data` to match the input', () => {
        expect(block.data).toEqual(data);
    });

    it('sets the `lastHash` to match the hash of the last block', () => {
        expect(block.lastHash).toEqual(lastBlock.hash);
    });
});