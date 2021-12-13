import {createConnection, createServer} from 'net';
import readline from 'readline';
import * as fs from "fs";
import initializeDataServer from "./initialiseDataServer";

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
let dataSocket = null;

export function connect(host, port) {
    const client = createConnection(port, host, () => {
        console.log('connected to server');
        initializeDataServer();
        rl.question('ftp@' + host + ':' + port + ": ", function(command) {
            client.write(command);
        })
        client.on('data', (data) => {
            console.log(data.toString() + typeof(data));
            const message = data.toString();
            const [status, ...args] = message.trim().split(' ');
            if(status === "221"){
                process.exit();
            }
            rl.question('ftp@' + host + ':' + port + "$", function(command) {
                const [commande, ...args] = command.trim().split(' ');
                if (commande === 'STOR'){
                    client.write(command);
                    let read = fs.createReadStream(args[0]);
                    read.on('data', (data) => {
                        dataSocket.write(data.toString());
                    })
                    read.on('end', () => {
                        dataSocket.write("226 file ok");
                    });
                } else {
                    client.write(command);
                }
            })
        })
    })
}

connect("localhost",4242);