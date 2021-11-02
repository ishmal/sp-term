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
        this.conn.addListener(this);
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

    parseCall(data, offset) {
        const chars = [];
        for (let i = 0; i < 10; i++) {
            const byte = data[offset + i];
            if (!byte) {
                break;
            }
            chars.push(String.fromCharCode(byte));
        }
        return chars.join("");
    }

    getLength(data, offset) {
        let len = 0;
        for (let i = 3; i >= 0; i--) {
            const byte = data[offset + i];
            len = len * 256 + byte;
        }
        return len;
    }

    toPrintableString(data) {
        const chars = [];
        const len = data.length;
        for (let i = HEADER_SIZE; i < len; i++) {
            const byte = data[i];
            if (byte >= 32 && byte < 128) {
                chars.push(String.fromCharCode(byte));
            } else {
                chars.push(".");
            }
        }
        return chars.join("");
    }

    receive(data) {
        const pkt = {
            dtg: (new Date()).toISOString(),
            port: data[HEADER_OFFSETS.AGWPE_PORT],
            kind: String.fromCharCode(data[HEADER_OFFSETS.DATA_KIND]),
            from: this.parseCall(data, HEADER_OFFSETS.CALL_FROM),
            to: this.parseCall(data, HEADER_OFFSETS.CALL_TO),
            length: this.getLength(data, HEADER_OFFSETS.DATA_LEN),
            data: this.toPrintableString(data)
        };
        this.listeners.forEach(lsnr => lsnr.receive(pkt));
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