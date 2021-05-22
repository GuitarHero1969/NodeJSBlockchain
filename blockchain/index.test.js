const Blockchain = require('./index');

// 1) show that we have started the chain with the genesis block
// 2) show that we can successfully add a new block to the chain

// 3) ensure that it validates a valid chain
// 4) make sure that it invalidates a chain with a corrupt genesis block
// 5) make sure that it invalidates a chain with a corrupt block at some point in the chain, that isn't
//    necessarily the genesis block

// 6) ensure that the chain is indeed replaced if the given chain is valid as input
// 7) demonstrate that the chain is not replaced if it receives a chain of less than or equal to
//      length

describe('Blockchain', () => {
    let bc;

    beforeEach(() => {
        bc = new Blockchain();
        bc2 = new Blockchain();
    });

    it('starts with genesis block', () => {
        expect(bc.chain[0]).toEqual(genesis());
    });

    it('adds a new block', () => {
        const data = 'foo';
        bc.addBlock(data);

        expect(bc.chain[bc.chain.length - 1].data).toEqual(data);
    });

    it('validates a valid chain', () => {
        bc2.addBlock('foo');

        expect(bc.isValidChain(bc2.chain)).toBe(true);
    });

    it('invalidates a chain with a corrupt genesis block', () => {
        bc2.chain[0].data = 'Bad data';

        expect(bc.isValidChain(bc2.chain)).toBe(false);
    });

    it('invalidates a corrupt chain', () => {
        bc2.addBlock('foo');
        bc2.chain[1].data = 'Not foo';

        expect(bc.isValidChain(bc2.chain)).toBe(false);
    });

    it('replaces the chain with a valid chain', () => {
        bc2.addBlock('goo');
        bc.replaceChain(bc2.chain);

        expect(bc.chain).toEqual(bc2.chain);
    });

    it('does not replace the chain with one which is less than or equal to length', () => {

        bc.addBlock('foo');
        // now that the first blockchain has some length -
        // the chain with the second block (chain) only has a length of one block, (the genesis) so
        // calling replaceChain will not be valid if we attempt to do so on the original chain
        bc.replaceChain(bc2.chain); // this should be invalid

        expect(bc.chain).not.toEqual(bc2.chain);
    });
});

// to run the app (Node.js)
//      npm run dev-test
//      Ctrl + C to stop (Terminate batch job)