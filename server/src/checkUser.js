import fs from "fs";

export default function checkUser(arg, socket){
    const users = JSON.parse(fs.readFileSync('./src/user.json', "utf-8"));
    const user= users.find((user) =>{
        return user.name === arg;
    });

    if (user){
        socket.user = user;
        return ("331 User exists waiting for pwd");
    }
    return("530 User does not exists");
}