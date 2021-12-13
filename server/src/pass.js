export default function checkPass(arg, socket){

    if (socket.user.password === arg){
        return ("230 You are connected");
    }
    return("530 Password not match");
}