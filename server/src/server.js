import {createConnection, createServer} from "net";
import fs from 'fs';
import help from "./help";
import pwd from "./pwd";
import cwd from "./cwd";
import list from "./list";
import checkPass from "./pass";
import checkUser from "./checkUser";


export function launch(port) {
    const server = createServer((socket) => {
        console.log("new connection.");
        socket.on("data", (data) => {
            const message = data.toString();

            const [command, ...args] = message.trim().split(" ");
            console.log(command, args);

            switch(command) {
                case "USER":
                    socket.write(`${checkUser(args[0], socket)}\r\n`);
                    break;
                case "PASS":
                    socket.write(`${checkPass(args[0], socket)}\r\n`);
                    break;
                case "LIST":
                    socket.write(`${list()}\r\n`);
                    break;
                case "CWD":
                    socket.write(`${cwd(args[0])}\r\n`);
                    break;
                case 'RETR':
                    let read = fs.createReadStream(args[0]);
                    read.on('data', (data) => {
                        socket.dataSocket.write(data);
                    })
                    socket.write("file stored in clients \r\n");
                    break;
                case 'STOR':
                    console.log("STOR:", socket.dataSocket);
                    socket.dataSocket.on("data", (data) => {
                        console.log(data.toString());
                        fs.writeFileSync("./uploads/temp.json", data.toString());
                        socket.write("220 \r\n");
                    });
                    break;
                case "FEAT":
                    socket.write("211 \r\n");
                    break;
                case "PWD":
                    socket.write(`257 ${pwd()}\r\n`);
                    break;
                case "PORT":
                    const [ip, port] = args;
                    socket.dataSocket =  createConnection(Number(port), ip, () => {
                        console.log('connected to dataServer');});
                    socket.write("200 \r\n");
                    break;
                case "TYPE":
                    socket.write("200 \r\n");
                    break;
                case "HELP":
                    socket.write(`200 ${help()} \r\n`);
                    break;
                case "QUIT":
                    socket.write('221 Service closing control connection');
                    socket.destroy();
                    break;
                default:
                    console.log("500 command not supported:", command, args);
            }
        });

        socket.write("220 Connexion established \r\n");
    });

    server.listen(port, () => {
        console.log(`server started at localhost:${port}`);
    });

}