import * as vscode from 'vscode';

export class Group {
    /**
     * The key that holds the translation
     */
    private key: string;

    /**
     * Keeps all the translations available for the given key
     */
    private languages: GroupTranslation[];

    constructor(key: string) {
        this.key = key;
        this.languages = [];
    }

    public getKey(): string { return this.key; }

    /**
     * Adds a translation to the given group
     */
    public addTranslation(language: string, translation: string, filePath: vscode.Uri, position?: vscode.Position) {
        this.languages.push({
            language: language,
            translation: translation,
            filePath: filePath,
            position: position
        });
    }

    /**
     * Returns all the translations for this group
     */
    public getTranslations(): GroupTranslation[] {
        return this.languages;
    }
}


interface GroupTranslation {
    language: string;
    translation: string;
    filePath: vscode.Uri;
    position: vscode.Position | undefined;
}