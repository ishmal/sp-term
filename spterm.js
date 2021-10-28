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

    connect(port = 8001) {
        try {
            const client = new net__default["default"].Socket();
            client.connect(port, '127.0.0.1', () => {

            });
            client.on('data', (data) => this.received(data));
        } catch(e) {
            console.log("connection fail: " + e);
        }
    }

    disconnect() {
        if (this.cli) {
            this.cli.disconnect();
            this.cli = null;
        }
    }

    received(data) {
        console.log("cli received:" + data);
        this.listeners.forEach( lsnr => lsnr.receive(data));
    }

    send(data) {
        this.cli.write(data);
    }

    addListener(lsnr) {
        this.listeners.push(lsnr);
    }
}

class SPTerm {
    constructor() {
        this.conn = new Connection();
        this.conn.addListener(this);
    }

    connect() {
        this.conn.connect();
    }

    receive(data) {
        console.log("received: " + data);
    }

}

exports.SPTerm = SPTerm;
