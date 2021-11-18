
import * as vscode from 'vscode';

class Configs {
    private static readonly assetsFolderPath = 'flutter-assets-helper.assets.folder_path';
    private static readonly ln10config = 'l10n.yaml';
    /**
     * Contains the path to the assets folder, if defined
     */
    private _assetsFolderPath: string | undefined;

    private _localizationsFolderPath: string | undefined;

    private _initialized: Thenable<void>;

    private _templateFile: string | undefined;


    constructor() {
        // Gets the config file
        const config = vscode.workspace.getConfiguration('flutter-assets-helper');


        // Gets the assets folder path
        this._assetsFolderPath = config.get(Configs.assetsFolderPath);


        this._initialized = this.readLocalizationFile();
    }

    /**
     * Returns a promise that resolves when the configs are initialized
     */
    get initialized(): Thenable<void> { return this._initialized; }

    /**
     * Reads the localization configuration and sets the _localizationsFolderPath
     */
    private async readLocalizationFile() {
        // Checks if ln10config file exists in this directory

        const ln10configFiles = await vscode.workspace.findFiles(Configs.ln10config, null, 1);
        if (ln10configFiles === undefined || ln10configFiles.length === 0) {
            console.log('No ln10 config file found');
            return;
        }

        const ln10configFile = ln10configFiles[0];

        try {
            await vscode.workspace.fs.stat(ln10configFile);

            const document = await vscode.workspace.openTextDocument(ln10configFile);


            const contentAsString = document.getText();
            contentAsString.split('\n').forEach((line) => {
                if (line.includes('arb-dir:')) {
                    this._localizationsFolderPath = line.split(':')[1].trim();
                } else if (line.includes('template-arb-file:')) {
                    this._templateFile = line.split(':')[1].trim();
                }
            });
            console.log(`Localizations folder path: ${this._localizationsFolderPath}`);
        } catch (error) {
            console.log(`[Configs] Got error: ${error}`);
        }
    }

    /**
     * Returns the path to the asset folder 
     */
    get assetsFolderPath(): string | undefined { return this._assetsFolderPath; }

    /**
     * Returns the name of the template file
     */
    get templateFile(): string | undefined { return this._templateFile; }

    /**
     * Returns the path to the localizations folder
     */
    get localizationsFolderPath(): string | undefined { return this._localizationsFolderPath; }

}


/// Create a singleton 
export const configs = new Configs();