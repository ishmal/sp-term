import { Connection } from './connection';


export const MessageTypes = {
    STATE: 0, // the state has changed
    FLOW: 1, // transmit flow control change
    RECEIVE: 2, // receive data
    SEND: 3, // send data
    OPEN: 4, // request open
    CLOSE: 5, // request close
    ERROR: 6 // report error
};

export const HEADER_OFFSETS = {
    AGWPE_PORT: 0,
    DATA_KIND: 4,
    PID: 6,
    CALL_FROM: 8,
    CALL_TO: 18,
    DATA_LEN: 28,
    USER: 32
}

const HEADER_SIZE = 36;

export class AgwConnection {

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