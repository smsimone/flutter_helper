import * as vscode from 'vscode';
import { configs } from './config';
import Translation from './model/translation';
import { translationParser } from './service/translation_parser';
import { TranslationProvider } from './utils/translation_adapter';


export function activate(context: vscode.ExtensionContext) {

	vscode.window.showInformationMessage('Flutter assets helper just started');

	configs.initialized.then(async () => {
		const files = await translationParser.getTranslationFiles();
		const translations = await translationParser.getTranslations(files);
		populateView(translations);
	});
}


function populateView(translations: Translation[]) {
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

export function deactivate() { }
