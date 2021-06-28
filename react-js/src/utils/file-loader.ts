
export default class FileLoader {

    public static loadVersionInfo() {
        // JSON is a special format recognized by react-scripts (included by webpack), hence just 'require' and done
        const json = require("../../package.json");
        return json.version;
    }

    public static async load(path: string) {
        // For files of other types, asynchronous fetch is required
        const file = await fetch(path);
        return await file.text();
    }

}
