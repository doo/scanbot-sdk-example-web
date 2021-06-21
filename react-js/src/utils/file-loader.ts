
export default class FileLoader {

    public static async load(path: string) {
        const file = await fetch(path);
        return await file.text();
    }

}
