import { Connection } from './connection';



export class SPTerm {
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

function runme() {
    const term = new SPTerm();
    term.connect();
}