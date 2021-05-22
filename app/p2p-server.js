const Websocket = require('ws');

const P2P_PORT = process.env.P2P_PORT || 5001;
const peers = process.env.PEERS ? process.env.PEERS.split(',') : []; // get all of the websocket addresses (if any)

// HTTP_PORT=3002 P2P_PORT=5002 PEERS=ws://localhost:5001 npm run dev

// Our sockets receive messages containing the stringified chains from their peers in the system

// 1) give the first blockchain app instance the ability to generate a server for other instances to connect to

/** Create the original websocket server and connect to existing servers. */
class P2pServer {
    
    constructor(blockchain) {
        this.blockchain = blockchain;
        this.sockets = [];
    }

    /** Gives the first block app instance the ability to
     * generate a server - for other instances to connect to.
     */
    listen() {
        const server = new Websocket.Server({ port: P2P_PORT });
        server.on('connection', socket => this.connectSocket(socket));

        // allow later instances of the app connect to the original one immediately
        this.connectToPeers();

        console.log(`Listening for peer-to-peer connections on: ${P2P_PORT}`);
    }

    connectToPeers() {
        peers.forEach(peer => {
            const socket = new Websocket(peer);

            socket.on('open', () => this.connectSocket(socket));
        });
    }

    connectSocket(socket) {
        this.sockets.push(socket);
        console.log('Socket connected');
        this.messageHandler(socket); // each of our sockets are ready to receive message events
        this.sendChain(socket);
    }

    /** Allow sockets to send messages to each other. */
    messageHandler(socket) {
        socket.on('message', message => {
            const data = JSON.parse(message);

            this.blockchain.replaceChain(data);
        });
    }

    sendChain(socket) {
        socket.send(JSON.stringify(this.blockchain.chain));
    }

    /**
     * @description Synchronise the blockchain across Peers
     */
    syncChains() {
        this.sockets.forEach(socket => this.sendChain(socket));
    }
}

module.exports = P2pServer;