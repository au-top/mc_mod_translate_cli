
import fs from "fs";
import path from "path";
import YAML from 'yaml';
import { translate as baiduTranslate } from "./api/baidu-translate";
import { translateCore } from "./core/translate-core";
import { program } from 'commander';
import figlet from "figlet";
import chalk from "chalk";
import inquirer from 'inquirer';
import { JarAnalyser } from "./api/mod-analyser/jar.analyser";
import { ModAnalyser } from "./core/mod-analyser";
import { JsonAnalyser } from "./api/mod-analyser/json.analyser";

program
    .option('--json', "target is json")
    .option('--jar', "target is jar")
    .option('-c, --config <path>', "app config path", "./config.yaml")
    .option('-t, --target <path>')
    .option('-o, --output <path>', "output path", './output');

program.parse();
const opts = program.opts();

// Check args
{
    if (opts.target == undefined) throw new Error(chalk.red("Need set arg -t --target or see --help "));
}

(async () => {

    // Print big text "Lang To"
    await new Promise((res) => figlet("Lang To ?", {
        font: "3D-ASCII",
        width: 140,
    }, (_, d) => void console.log(chalk.green(d)) || res(d)));

    const { appid, key } = YAML.parse(fs.readFileSync(path.resolve(".", opts.config), "utf8"));

    const targetPath = path.resolve(".", opts.target);
    const outputPath = path.resolve(".", opts.output);

    const prompt = inquirer.createPromptModule();

    const modAnalyser: ModAnalyser = (() => {
        if (opts.json) {
            return new JsonAnalyser();
        } else {
            return new JarAnalyser();
        }
    })();

    const rawLangJson = await modAnalyser.load(targetPath);

    const { fromLang } = await prompt({
        "name": "fromLang",
        "type": "input",
        "message": "translate from lang",
        "default": "auto",
        "validate": (i) => {
            return i.length == 2 || i.length == 4;
        }
    });

    const { toLang } = await prompt({
        "name": "toLang",
        "type": "input",
        "message": "translate target lang",
        "default": "zh",
        "validate": (i) => {
            return i.length == 2;
        }
    });

    const translateRes = await translateCore(rawLangJson, (queryData) => baiduTranslate(queryData, appid, key, fromLang, toLang));

    const outputFilePath = await modAnalyser.out(outputPath, JSON.stringify(translateRes));

    console.log(`Success Output File ${ chalk.green(outputFilePath) }`)

})().catch(console.error);
