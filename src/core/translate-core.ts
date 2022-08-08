import { asyncSleep } from "../functions/async-sleep";
import cliProgress from "cli-progress";
import chalk from "chalk";

export async function translateCore(data: Record<string, string>, translateCallback: (queryStr: string) => Promise<translateKeyVal[] | null>) {

    const progressBar = new cliProgress.SingleBar({
        "format": 'translate ' + chalk.green('{bar}') + ' | {percentage}% || {value}/{total} ',
    }, cliProgress.Presets.shades_classic);
    const translateState = {
        total: 0,
        now: 0,
    }
    const originalList = Object.entries(data);
    translateState.total = originalList.length;
    progressBar.start(originalList.length, 0);

    const translateResult: Record<string, string> = {};

    for (
        let translateList = originalList.splice(0, 50);
        originalList.length || translateList.length;
        translateList = originalList.splice(0, 50)
    ) {
        // filter char
        // create translate list
        const queryStr = translateList
            .map(
                (v) => v[1]
                    .split("%s").join("<s>")
                    .split("\n").join("\\n")
            )
            .join("\n");

        // use to console.log
        // translate
        // get resList
        const netTList = (await translateCallback(queryStr) ?? []).map(
            (v: translateKeyVal) => v.dst
        );
        // setup
        // transform char
        netTList.forEach((val, index) => {
            translateResult[translateList[index][0]] = val
                .split("<s>").join("%s")
                .split("\\n").join("\n");
        });

        translateState.now += translateList.length;

        progressBar.update(translateState.now);

        await asyncSleep(1200);
    }

    progressBar.stop();

    return translateResult;
}