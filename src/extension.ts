import * as vscode from 'vscode';
import { configs } from './config';
import { translationParser } from './service/translation_parser';
import { populateTranslationsView, populateTranslationFilesView } from './service/view_helper';


export function activate(context: vscode.ExtensionContext) {
	configs.initialized.then(async () => {
		const files = await translationParser.getTranslationFiles();
		populateTranslationFilesView(files.map(f => f.path));
		const translations = await translationParser.getTranslations(files);
		populateTranslationsView(translations);
	});
}


export function deactivate() { }
