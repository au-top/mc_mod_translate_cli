import { ModAnalyser } from "../../core/mod-analyser";
import fs from "fs";
import JSZIP from "jszip";



export class JsonAnalyser extends ModAnalyser {
    jszip: JSZIP;
    transformFilePath: string | undefined;
    constructor () {
        super();
        this.jszip = new JSZIP();
    }
    async load(targetPath: string): Promise<Record<string, any>> {
        return JSON.parse(fs
            .readFileSync(targetPath)
            .toString())
    }
    async out(outputPath: string, data: string): Promise<string> {
        fs.writeFileSync(outputPath, data);
        return outputPath;
    }

}