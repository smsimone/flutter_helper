import * as vscode from 'vscode';
import { TreeItem } from '../model/treeitem';


export class TranslationFileAdapter implements vscode.TreeDataProvider<TreeItem>{

    files: TreeItem[];

    constructor(files: string[]) {
        this.files = files.map(f => {
            const label = f.substring(f.lastIndexOf('/') + 1);

            return new TreeItem(label, undefined, undefined, {
                title: "Open",
                command: "vscode.open",
                arguments: [vscode.Uri.parse(f)]
            });
        });
    }

    onDidChangeTreeData?: vscode.Event<void | TreeItem | null | undefined> | undefined;

    getTreeItem(element: TreeItem): TreeItem | Thenable<TreeItem> {
        return element;
    }

    getChildren(element?: TreeItem): vscode.ProviderResult<TreeItem[]> {
        return this.files;
    }
}