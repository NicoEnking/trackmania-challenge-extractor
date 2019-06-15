import readline from "readline";

export class ConsoleInterface {

    static readPathFromConsole(): Promise<string> {
        return new Promise((resolve, reject) => {
            const rl = this.createReadLineInterface();
            rl.question(`Please enter the path of the folder containing the maps you'd like to add to the challenge:\n`, answer => {
                rl.close();
                resolve(answer);
            });
        });
    }

    private static createReadLineInterface() {
        return readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
    }

}