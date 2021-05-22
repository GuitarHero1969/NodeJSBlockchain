const express = require('express');
const bodyParser = require('body-parser');
const Blockchain = require('../blockchain');
const P2pServer = require('./p2p-server');

// define which port our application should listen for requests on
const HTTP_PORT = process.env.HTTP_PORT || 3001;

const app = express();
const bc = new Blockchain();
const p2pServer = new P2pServer(bc);

app.use(bodyParser.json());

// add the first endpoint
app.get('/blocks', (req, res) => {
    res.json(bc.chain);
});

/** Allow users to add blocks to the chain with Express application with IRouter.post. */
app.post('/mine', (req, res) => {
    const block = bc.addBlock(req.body.data);
    console.log(`New block added: ${block.toString()}`);

    p2pServer.syncChains();

    res.redirect('/blocks');
});

app.listen(HTTP_PORT, () => console.log(`Listening on port ${HTTP_PORT} for the API`));

// start the websocket server
p2pServer.listen();

// to run the express server, enter "npm run dev" on the command line
// to open more nodes, enter "HTTP_PORT=300X P2P_PORT=500X PEERS=ws://localhost:5001 npm run dev"
// where X is an increment on the already running port(s)



