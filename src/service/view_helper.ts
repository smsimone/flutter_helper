import * as vscode from 'vscode';
import Translation from '../model/translation';
import { TranslationProvider } from '../utils/translation_adapter';
import { TranslationFileAdapter } from '../utils/translation_file_adapter';


/**
 * Build the sidebar view with all the key available
 */
export function populateTranslationsView(translations: Translation[]) {
    try {
        let provider = new TranslationProvider(translations);
        vscode.window.createTreeView('available_translations', {
            treeDataProvider: provider
        });
        console.log('[FLutterHelper] Created view');
    } catch (e) {
        console.error(`[FlutterHelper] Got error while creating tree view: ${e}`);
    }
}

/**
 * Build the sidebar view with all the translation files available
 */
export function populateTranslationFilesView(translationFiles: string[]) {
    try {
        const provider = new TranslationFileAdapter(translationFiles);
        vscode.window
            .createTreeView('available_files', {
                treeDataProvider: provider
            });
    } catch (e) {
        console.error(`[FlutterHelper] Got error while creating tree view: ${e}`);
    }
}

