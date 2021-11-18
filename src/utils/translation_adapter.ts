import * as vscode from 'vscode';
import { Group } from '../model/group';
import Translation from '../model/translation';
import { TreeItem } from '../model/treeitem';


export class TranslationProvider implements vscode.TreeDataProvider<TreeItem>{
    groups: Group[] = [];

    data: TreeItem[] = [];

    constructor(translations: Translation[]) {
        const keys = translations[0].getEntries().map(e => e.getKey());

        keys.forEach((k) => {
            const group = new Group(k);
            translations.forEach((t) => {
                const translationEntry = t.getEntryOfKey(k);
                if (translationEntry !== undefined) {
                    group.addTranslation(t.getLanguage(), translationEntry.getValue(), t.getFilePath(), translationEntry.getPosition());
                }
            });
            this.groups.push(group);
        });

        // sort groups alphabetically on their key
        this.groups = this.groups.sort((a, b) => a.getKey().localeCompare(b.getKey()));

        this.data = this.groups.map(g => {
            const children = g.getTranslations().map(translation => {
                return new TreeItem(translation.language, translation.translation, undefined, {
                    title: 'Open translation file',
                    command: 'flutterHelper.open_and_move',
                    arguments: [translation.filePath, translation.position],
                });
            });
            return new TreeItem(g.getKey(), undefined, children);
        });
    }

    onDidChangeTreeData?: vscode.Event<void | TreeItem | null | undefined> | undefined;

    getTreeItem(element: TreeItem): TreeItem | Thenable<TreeItem> {
        return element;
    }

    getChildren(element?: TreeItem): vscode.ProviderResult<TreeItem[]> {
        if (element === undefined) {
            return this.data;
        }
        return element.children;
    }
}