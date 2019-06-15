import { ConsoleInterface } from "./consoleInterface";
import { FileReader } from "./fileReader";
require('ts-node').register();

const fr = new FileReader();

setMapPath();

async function setMapPath() {

    const path = await ConsoleInterface.readPathFromConsole();

    try {

        await fr.setMapPath(path);

    } catch (err) {

        console.error(err);
        setMapPath();
        return;

    }

    readMapFiles();

}

async function readMapFiles() {

    try {

        await fr.generateChallengeXML();

        console.log('Data written to "output.txt"');

    } catch (err) {

        console.error(err);
        setMapPath();
        return;

    }

}