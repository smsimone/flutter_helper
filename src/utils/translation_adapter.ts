import * as vscode from 'vscode';
import { Group } from '../model/group';
import Translation from '../model/translation';


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
                    group.addTranslation(t.getLanguage(), translationEntry.getValue());
                }
            });
            this.groups.push(group);
        });

        // sort groups alphabetically on their key
        this.groups = this.groups.sort((a, b) => a.getKey().localeCompare(b.getKey()));

        this.data = this.groups.map(g => {
            const children = g.getTranslations().map(translation => new TreeItem(translation.language, translation.translation));
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


class TreeItem extends vscode.TreeItem {
    children: TreeItem[] | undefined;

    constructor(label: string, description?: string | undefined, children?: TreeItem[]) {
        super(
            label,
            children === undefined ? vscode.TreeItemCollapsibleState.None :
                vscode.TreeItemCollapsibleState.Expanded,
        );
        this.children = children;
        this.description = description;
    }
}