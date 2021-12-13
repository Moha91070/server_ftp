import {createServer} from "net";
import fs from "fs";

let dataSocket = null;

export default function initializeDataServer(){
    const server = createServer((socket) => {
        console.log("new connection.");
        dataSocket = socket;
        socket.on("data", (data) => {
            fs.writeFileSync("./uploads/temp.json", data.toString());
        });
    });
    server.listen(4243, () => {
        console.log(`dataServer started at localhost: 4243`);
    });
}