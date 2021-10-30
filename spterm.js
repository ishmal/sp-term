'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var net = require('net');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var net__default = /*#__PURE__*/_interopDefaultLegacy(net);

class Connection {

    constructor() {
        this.cli = null;
        this.listeners = [];
    }

    async connect(port = 8000) {
        const prom = new Promise((resolve, reject) => {
            try {
                const client = new net__default["default"].Socket();
                client.connect(port, '127.0.0.1');
                client.on('connect', () => {
                    this.cli = client;
                    resolve(true);
                });
                client.on('error', (msg) => reject(msg));
                client.on('data', (data) => this.received(data));
            } catch(e) {
                console.log("connection fail: " + e);
                reject(e);
            }    
        });
        return prom;
    }

    async disconnect() {
        const prom = new Promise((resolve, reject) => {
            try {
                if (this.cli) {
                    this.cli.disconnect(() => resolve(true));
                    this.cli = null;
                } else {
                    resolve(true);
                }    
            } catch(e) {
                reject(e);
            }
        });
        return prom;
    }

    received(data) {
        this.listeners.forEach( lsnr => lsnr.receive(data));
    }

    async send(data) {
        const prom = new Promise((resolve, reject) => {
            if (this.cli) {
                try {
                    this.cli.write(data, () => {
                        resolve(true);
                    });    
                } catch(e) {
                    reject(e);
                }    
            } else {
                reject("no client");
            }
        });
        return prom;
    }

    addListener(lsnr) {
        this.listeners.push(lsnr);
    }
}

const HEADER_OFFSETS = {
    AGWPE_PORT: 0,
    DATA_KIND: 4,
    PID: 6,
    CALL_FROM: 8,
    CALL_TO: 18,
    DATA_LEN: 28,
    USER: 32
};

const HEADER_SIZE = 36;

class AgwConnection {

    constructor() {
        this.conn = new Connection();
        this.listeners = [];
    }

    async connect() {
        await this.conn.connect();
    }

    async disconnect() {
        await this.conn.disconnect();
     }

    addListener(lsnr) {
        this.listeners.push(lsnr);
    }

    // todoL send parsed data
    receive(data) {
        lsnrs.forEach(data => lsnr.receive(data));
    }

    async send(data) {
        await this.conn.send(data);
    }

    header() {
        const header = new Uint8Array(HEADER_SIZE);
        return header;
    }

    async monitor() {
        const header = this.header();
        header[HEADER_OFFSETS.DATA_KIND] = 0x6d; // 'm'
        await this.send(header);
    }

    async version() {
        const header = this.header();
        header[HEADER_OFFSETS.DATA_KIND] = 0x52; // 'R'
        await this.send(header);
    }



}

class SPTerm {
    constructor() {
        this.conn = new AgwConnection();
        this.conn.addListener(this);
    }

    async connect() {
        await this.conn.connect();
        await this.conn.version();
        await this.conn.monitor();
    }

    receive(data) {
        console.log("received: " + data);
    }

}

function runme() {
    const term = new SPTerm();
    term.connect();
}

runme();

exports.SPTerm = SPTerm;
