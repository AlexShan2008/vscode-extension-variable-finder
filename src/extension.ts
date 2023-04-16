// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import * as caseConverter from "change-case";

async function searchVariables(textEditor: vscode.TextEditor, input: string) {
  const variableSearchResults: Array<any> = [];

  // eslint-disable-next-line @typescript-eslint/naming-convention
  const snake_case = caseConverter.snakeCase(input);
  const camelCase = caseConverter.camelCase(input);

  const regex = new RegExp(
    "\\\\b(?:" + snake_case + "|" + camelCase + ")\\\\b",
    "g"
  );

  for (let i = 0; i < textEditor.document.lineCount; i++) {
    const textLine = textEditor.document.lineAt(i);
    let match = regex.exec(textLine.text);

    while (match !== null) {
      variableSearchResults.push({ range: textLine.range });

      textEditor.setDecorations(
        variableSearchResults as unknown as vscode.TextEditorDecorationType,
        {
          range: textLine.range,
        } as unknown as vscode.DecorationOptions[]
      );
      match = regex.exec(textLine.text);
    }
  }

  return variableSearchResults;
}

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  let searchHandler = vscode.commands.registerCommand(
    "alex-shan.search-variable",
    async (textEditor) => {
      vscode.window
        .showInputBox({ prompt: "请输入要搜索的变量名" })
        .then(async (value) => {
          if (value !== undefined) {
            const variableSearchResults: Array<any> = await searchVariables(
              textEditor,
              value
            );

            if (variableSearchResults.length === 0) {
              vscode.window.showInformationMessage("未找到任何匹配项");
            } else {
              for (const result of variableSearchResults) {
                await vscode.commands.executeCommand(
                  "editor.action.addSelectionToNextFindMatch"
                );
              }
            }
          } else {
            vscode.window.showInformationMessage("未找到任何匹配项");
          }
        });
    }
  );

  context.subscriptions.push(searchHandler);
}

// export function activate(context: vscode.ExtensionContext) {
//   // Use the console to output diagnostic information (console.log) and errors (console.error)
//   // This line of code will only be executed once when your extension is activated
//   console.log(
//     'Congratulations, your extension "alex-shan" is now active!'
//   );

//   // The command has been defined in the package.json file
//   // Now provide the implementation of the command with registerCommand
//   // The commandId parameter must match the command field in package.json
//   let disposable = vscode.commands.registerCommand(
//     "alex-shan.helloWorld",
//     () => {
//       // The code you place here will be executed every time your command is executed
//       // Display a message box to the user
//       vscode.window.showInformationMessage("Hello World from Variable Finder!");
//     }
//   );

//   context.subscriptions.push(disposable);
// }

// This method is called when your extension is deactivated
export function deactivate() {}
