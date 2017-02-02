'use strict';
import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {

    let gotofunc = vscode.commands.registerCommand('extension.gotofunc', () => {
        goToFunction();
    });

    context.subscriptions.push(gotofunc);
}

export function goToFunction(){
    let editor = vscode.window.activeTextEditor;

    if(!editor.selection.isEmpty){
        let selectedRange = new vscode.Range(editor.selection.start.line, editor.selection.start.character, editor.selection.end.line, editor.selection.end.character);
        let selectedText = editor.document.getText(selectedRange);
        let lastdot = editor.document.fileName.lastIndexOf(".");
        let tsfilename = editor.document.fileName.substring(0,lastdot)+".ts";

        vscode.workspace.openTextDocument(tsfilename).then(doc => {
		    vscode.window.showTextDocument(doc).then(tseditor => {

                let editorContent = tseditor.document.getText();
                let editorArray = editorContent.split("\n");
                var checkFun = false;

                for (var index = 0; index < editorArray.length; index++) {
                    var element = editorArray[index];
                    var cleanElement  = element.trim().replace(" ","");
                    let funcRe = "(^"+selectedText+")(\((.+)\)|\(\))((.+)\{|\{)";
                    let checkForFunction = cleanElement.match(funcRe);

                    if (checkForFunction) {
                        revealLine(index);
                        checkFun = true;
                        break;
                    }
                }
                if (!checkFun) {
                    vscode.window.showInformationMessage("No Function Found !!");
                }
            });
        });
    }
}

function revealLine(line: number) {
    let reviewType: vscode.TextEditorRevealType = vscode.TextEditorRevealType.InCenter;
    if (line == vscode.window.activeTextEditor.selection.active.line) {
        reviewType = vscode.TextEditorRevealType.InCenterIfOutsideViewport;
    }
    var newSelection = new vscode.Selection(line, 0, line, 0);
    vscode.window.activeTextEditor.selection = newSelection;
    vscode.window.activeTextEditor.revealRange(newSelection, reviewType);
}

export function deactivate() {
}