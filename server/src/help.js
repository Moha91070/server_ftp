import fs from "fs";

export default function help() {
    const helps = JSON.parse(fs.readFileSync('./src/help.json', "utf-8"));
    let val = JSON.stringify(helps).split(',');
    let str = "";
    val.forEach((line) => {
        str += line + "\n"
    })
    return str;
};