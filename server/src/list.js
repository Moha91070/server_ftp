import fs from "fs";


export default function list() {
    let files = fs.readdirSync(process.cwd());
    let finalStr = "status: 150\n";
    files.forEach((file) => {
        finalStr += file + '\n';
    })
    return (finalStr);
}