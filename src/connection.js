import net from 'net';


export class Connection {

    constructor() {
        this.cli = null;
        this.listeners = [];
    }

    async connect(port = 8000) {
        const prom = new Promise((resolve, reject) => {
            try {
                const client = new net.Socket();
                client.connect(port, '127.0.0.1');
                client.on('connect', () => {
                    this.cli = client;
                    resolve(true);
                });
                client.on('error', (msg) => reject(msg))
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
                reject("no client")
            }
        });
        return prom;
    }

    addListener(lsnr) {
        this.listeners.push(lsnr);
    }
}