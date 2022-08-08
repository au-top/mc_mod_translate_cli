export abstract class ModAnalyser {

    /// return JSON Struct
    abstract load(targetPath: string): Promise<Record<string, any>>;

    abstract out(outputPath: string, data: string): Promise<string>;
}