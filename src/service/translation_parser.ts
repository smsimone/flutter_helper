import * as vscode from 'vscode';
import { configs } from "../config";
import Translation from "../model/translation";

class TranslationParser {
    /**
     * Search inside of {config.translationFile} for all the translation files
     * available
     * 
     * @returns a list of paths to the available translation files
     */
    public async getTranslationFiles(): Promise<vscode.Uri[]> {

        if (configs.localizationsFolderPath === undefined) {
            console.log('[TranslationParser] Localizations folder path is not defined');
            return [];
        }

        const folders = vscode.workspace.workspaceFolders;
        if (folders !== undefined) {
            const localizationsDirectory: string = folders[0].uri.path + "/" + configs.localizationsFolderPath;

            const files = (await vscode.workspace.fs.readDirectory(vscode.Uri.parse(localizationsDirectory))).filter((file) => {
                return file[0].endsWith('.arb');
            }).map((file) => vscode.Uri.parse(`${localizationsDirectory}/${file[0]}`));

            console.log(`[TranslationParser] Found ${files.length} localization files`);

            return files;
        }

        return [];
    }

    /**
     * Parse all the translation files given and returns a list of translations
     */
    public async getTranslations(uris: vscode.Uri[]): Promise<Translation[]> {
        const translations: Translation[] = [];

        for await (const uri of uris) {
            translations.push(await this.parseTranslationFile(uri));
        }

        console.log(`[TranslationParser] Parsed ${translations.length} translations`);

        return translations;
    }

    /**
     * Reads the translation file and returns a list of translations.
     * @returns a list of translations
     */
    private async parseTranslationFile(filePath: vscode.Uri): Promise<Translation> {
        const translation = new Translation(filePath);

        await translation.parseTranslationFile(filePath);

        return translation;
    }

}


export const translationParser = new TranslationParser();