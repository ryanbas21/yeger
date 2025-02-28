#!/usr/bin/env node
const { ESLint } = require('eslint')
const c = require('picocolors')

// eslint-disable-next-line import/newline-after-import
;(async function main() {
  // 1. Create an instance.
  const fix = process.argv.includes('--fix')
  const eslint = new ESLint({ fix })

  // 2. Lint files.
  const results = await eslint.lintFiles([
    './**/*.{astro,html,js,jsx,json,md,ts,tsx,vue,yaml,yml}',
  ])
  const hasErrors = results.some(
    ({ errorCount, fatalErrorCount }) => errorCount > 0 || fatalErrorCount > 0
  )

  if (fix) {
    await ESLint.outputFixes(results)
  }

  // 3. Format the results.
  const formatter = await eslint.loadFormatter('stylish')
  const resultText = formatter.format(results)

  // 4. Output it.
  if (resultText.length > 0) {
    // eslint-disable-next-line no-console
    console.log(resultText)
  } else {
    // eslint-disable-next-line no-console
    console.log(c.green('✔ No ESLint warnings or errors'))
  }
  process.exit(hasErrors > 0 ? 1 : 0)
})().catch((error) => {
  process.exitCode = 1
  console.error(error)
})
