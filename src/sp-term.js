import { AgwConnection } from './agw-connection';


export class SPTerm {
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
        const str = JSON.stringify(data, null, 2);
        console.log("received: " + str);
    }

}

function runme() {
    const term = new SPTerm();
    term.connect();
}

runme();
