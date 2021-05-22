const Block = require('./blockchain/block');

const fooBlock = Block.mineBlock(Block.genesis(), 'foo');
console.log(fooBlock.toString());

// to run the app (Node.js)
//      npm run dev-test or run test
//      Ctrl + C to stop (Terminate batch job)


