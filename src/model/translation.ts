import * as vscode from 'vscode';

export default class Translation {

    private language: string;

    private entries = new Map<string, TranslationEntry>();

    constructor() {
        this.language = '';
    }

    public getLanguage(): string { return this.language; }

    public getEntries(): TranslationEntry[] {
        return Array.from(this.entries.values());
    }

    /**
     * Returns the translationEntry of the given key
     */
    public getEntryOfKey(key: string): TranslationEntry | undefined {
        return this.entries.get(key);
    }

    /**
     * Parse the translation file and builds the translation entries for this language
     * @param filePath 
     */
    public async parseTranslationFile(filePath: vscode.Uri) {
        const path = filePath.fsPath;
        this.language = path.substring(path.lastIndexOf('/') + 1, path.lastIndexOf('.'));

        const fileContent = (await vscode.workspace.fs.readFile(filePath)).toString();
        // read fileContent as a json
        const json = JSON.parse(fileContent);

        const keys = Object.keys(json);

        // For now we'll retrieve only the entries with a value
        keys.filter((key) => !key.startsWith('@')).forEach((key) => {
            const value = json[key];
            const entry = new TranslationEntry(key, value);

            const metadata = json['@' + key];

            if (metadata !== undefined) {
                const description = metadata['description'];
                entry.setDescription(description);
                const placeholdersMap: object | undefined = metadata['placeholders'];
                if (placeholdersMap !== undefined) {
                    const placeholders = Object.keys(placeholdersMap);
                    entry.setPlaceholders(placeholders);
                }
            }
            this.entries.set(key, entry);
        });

        console.log(`[Translation] Parsed ${this.language} translation file for a total of ${this.entries.size} keys`);
    }
}


class TranslationEntry {

    private key: string;

    private value: string;

    private description: string | undefined;

    private placeholders: string[] | undefined;


    constructor(key: string, value: string) {
        this.key = key;
        this.value = value;
    }

    public getKey(): string { return this.key; }

    public getValue(): string { return this.value; }

    public getDescription(): string | undefined { return this.description; }

    public getPlaceholders(): string[] | undefined { return this.placeholders; }

    public setDescription(description: string | undefined) { this.description = description; }

    public setPlaceholders(placeholders: string[]) { this.placeholders = placeholders; }
}