import { ModAnalyser } from "../../core/mod-analyser";
import fs from "fs";
import path from "path";
import YAML from 'yaml';
import JSZIP from "jszip";
import { translate as baiduTranslate } from "../baidu-translate";
import { translateCore } from "../../core/translate-core";
import { program } from 'commander';
import figlet from "figlet";
import chalk from "chalk";
import inquirer from 'inquirer';

// get [path] [filename] [ext] 
const langFilePathRegExp = /^(assets\/[\s\S]*\/lang\/)([\s\S]*)\.(json)$/i;


export class JarAnalyser extends ModAnalyser {
    jszip: JSZIP;
    transformFilePath: string | undefined;
    constructor () {
        super();
        this.jszip = new JSZIP();
    }
    async load(targetPath: string): Promise<Record<string, any>> {
        const prompt = inquirer.createPromptModule();
        const fileContent = fs.readFileSync(targetPath);
        this.jszip = await this.jszip.loadAsync(fileContent);

        const langFiles = Object.values(this.jszip.files).filter((file) => langFilePathRegExp.test(file.name));
        const { transformFilePath } = (await prompt({
            "name": "transformFilePath",
            "type": "list",
            "message": "choice translate file",
            "choices": langFiles.map(e => e.name),
            "validate": (input, answer) => {
                return answer["path"];
            },
            "loop": true,
        }));

        this.transformFilePath = transformFilePath;

        const dataStr = Buffer.from((await this.jszip.file(transformFilePath)!.async("uint8array"))).toString("utf8");

        return JSON.parse(dataStr);
    }
    async out(outputPath: string, data: string): Promise<string> {
        const zipFile = Buffer.from(await this.jszip.file(langFilePathRegExp.exec(this.transformFilePath!)![1] + "zh_cn.json", data).generateAsync({
            type: "arraybuffer"
        }));
        fs.writeFileSync(outputPath, zipFile);
        return outputPath;
    }

}