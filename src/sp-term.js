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
        console.log("received: " + data);
    }

}

function runme() {
    const term = new SPTerm();
    term.connect();
}

runme();
