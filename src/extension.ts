import * as vscode from 'vscode';
import { configs } from './config';
import { translationParser } from './service/translation_parser';


export function activate(context: vscode.ExtensionContext) {

	vscode.window.showInformationMessage('Flutter assets helper just started');

	configs.initialized.then(async () => {
		const files = await translationParser.getTranslationFiles();
		const transations = translationParser.getTranslations(files);
	});
}

export function deactivate() { }
