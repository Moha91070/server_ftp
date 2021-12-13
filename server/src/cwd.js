

export default function cwd(path) {
    try {
        process.chdir(path);
        return(`250 ${process.cwd()}`);
    }
    catch (e) {
        return(`550 ${e.toString()}`);
    }
}