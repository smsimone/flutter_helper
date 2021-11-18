import * as vscode from 'vscode';

export class TreeItem extends vscode.TreeItem {
    children: TreeItem[] | undefined;

    constructor(label: string, description?: string | undefined, children?: TreeItem[], command?: vscode.Command) {
        super(
            label,
            children === undefined ? vscode.TreeItemCollapsibleState.None :
                vscode.TreeItemCollapsibleState.Expanded,
        );
        this.children = children;
        this.description = description;
        this.command = command;
    }
}