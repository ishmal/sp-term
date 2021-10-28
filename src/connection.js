import net from 'net';


export class Connection {

    constructor() {
        this.cli = null;
        this.listeners = [];
    }

    connect(port = 8001) {
        try {
            const client = new net.Socket();
            client.connect(port, '127.0.0.1', () => {

            })
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