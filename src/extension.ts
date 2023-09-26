import * as vscode from 'vscode'

const JSON5 = require('json5')
const postcss = require('postcss')
const postcssJs = require('postcss-js')
const prettier = require('prettier')

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
  let disposable = vscode.commands.registerCommand('css-in-js-converter.convert', async () => {
    const activeEditor = vscode.window.activeTextEditor
    if (!activeEditor) {
      return
    }
    const selection = activeEditor.selection
    let text = activeEditor.document.getText(selection)

    let jsxObject
    try {
      console.log('text: 222', text)
      jsxObject = JSON5.parse(text)
    } catch (error) {
      try {
        jsxObject = JSON5.parse(`{${text}}`)
      } catch (error) {
        console.log('JSON5.parse error:', error)
      }
    }

    if (jsxObject) {
      text = await jss2scss(jsxObject)
    } else {
      text = await scss2jss(text)
      console.log('text:', text)
    }

    activeEditor.edit(editBuilder => {
      console.log('text:', text)
      editBuilder.replace(selection, text)
    })
  })

  context.subscriptions.push(disposable)
}

export function deactivate() {}
