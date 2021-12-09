import * as vscode from 'vscode';
import { configs } from './config';
import { translationParser } from './service/translation_parser';
import { populateTranslationsView, populateTranslationFilesView } from './service/view_helper';


export function activate(context: vscode.ExtensionContext) {

	/**
	 * Register a command that opens the translation file and moves the cursor to the given entry
	 */
	vscode.commands.registerCommand('flutterHelper.open_and_move', (filePath?: vscode.Uri, position?: vscode.Position) => {
		if (filePath === undefined) { return; }

		vscode.commands.executeCommand('vscode.open', filePath);

		if (position === undefined) { return; }

		const editor = vscode.window.activeTextEditor;
		if (editor === undefined) { return; }

		var newSelection = new vscode.Selection(position, position);
		editor.selection = newSelection;

		editor.revealRange(newSelection);
	});

	/**
	 * Registers a command to manually reload the localization data
	 */
	vscode.commands.registerCommand('flutterHelper.reload', () => { loadData(); });

	loadData();
}


export function deactivate() { }

/**
 * Loads the translation files and populates the translation view
 */
function loadData() {
	configs.initialized.then(async () => {
		const files = await translationParser.getTranslationFiles();
		populateTranslationFilesView(files.map(f => f.path));
		const translations = await translationParser.getTranslations(files);
		populateTranslationsView(translations);
	});
}