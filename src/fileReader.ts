import fs from "fs";
import { promisify } from "util";
import njsPath from "path";
import xml from "xml-js";

export class FileReader {

    private gbxFiles: string[] = [];

    private readDirAsync = promisify(fs.readdir);
    private readFileAsync = promisify(fs.readFile);

    constructor() {}

    async setMapPath(path: fs.PathLike) {

        if (fs.lstatSync(path).isDirectory) {

            this.gbxFiles = [];

            const files = await this.readDirAsync(path);

            const readGbxFiles = files.filter(el => /\.Gbx$/.test(el));

            if (readGbxFiles.length === 0) {
                throw new Error(`Could not find any .gbx files in this folder. Please check wether this is the correct folder or not.`);
            }

            readGbxFiles.forEach((val, index) => {

                // Add whole path to string
                this.gbxFiles.push(njsPath.join(path.toString(), val));

            });

        } else {

            throw new Error(`The path ${path} is not a directory. Please enter the correct path to the folder including the gbx files you want to add to this challenge.`);

        }

    }

    async generateChallengeXML() {

        let result = [];

        if (this.gbxFiles.length === 0) {
            
            throw new Error(`The directory you chose for the maps is not containing any gbx files. Please try again.`);

        }

        for (const file of this.gbxFiles) {
            const content = await this.readFileAsync(file, { encoding: 'ascii' });

            const regxp = new RegExp('<ident(.*?)[\/]>', 'gm');

            const data = content.match(regxp);

            const jsonData = xml.xml2js(data![0]);

            result.push({
                challenge: {
                    file: file.substring(file.indexOf('Tracks\\') + 7), // Removes unnecessary parts of the file path
                    ident: jsonData.elements[0].attributes.uid
                }
            });
        }

        let xmlString = "";

        // Generate each individual xml element
        result.forEach(elem => {
            xmlString += xml.js2xml(elem, { compact: true, indentAttributes: true, spaces: 3 }) + "\n";
        })

        fs.writeFileSync('output.txt', xmlString, { encoding: 'utf8' });

    }

}