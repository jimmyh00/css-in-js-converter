import * as vscode from 'vscode'
import * as JSON5 from 'json5'
import * as postcss from 'postcss'
import * as postcssJs from 'postcss-js'
import * as prettier from 'prettier'

// jss => scss
async function jss2scss(jsxObject: any) {
  const processor = postcss()
  const css = processor.process(jsxObject, {
    parser: postcssJs,
  }).css
  const formattedCode = await prettier.format(css, {
    parser: 'scss',
  })

  return formattedCode
}

// scss => jss
async function scss2jss(text: string) {
  const root = postcss.parse(text)
  const result = `const converted = ${JSON.stringify(postcssJs.objectify(root))}`
  const formattedCode = await prettier.format(result, {
    parser: 'babel',
    singleQuote: true,
    trailingComma: 'all',
    semi: false,
    tabWidth: 2,
    printWidth: 50,
  })
  const code = formattedCode.replace('const converted = ', '')
  return code
}

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand('cssInJsConverter.convert', async () => {
    const activeEditor = vscode.window.activeTextEditor
    if (!activeEditor) {
      return
    }
    const selection = activeEditor.selection
    let text = activeEditor.document.getText(selection)

    let jsxObject
    try {
      jsxObject = JSON5.parse(text)
    } catch (error) {
      try {
        jsxObject = JSON5.parse(`{${text}}`)
      } catch (error) {}
    }

    if (jsxObject) {
      text = await jss2scss(jsxObject)
    } else {
      text = await scss2jss(text)
    }

    activeEditor.edit(editBuilder => {
      editBuilder.replace(selection, text)
    })
  })

  context.subscriptions.push(disposable)
}

export function deactivate() {}
