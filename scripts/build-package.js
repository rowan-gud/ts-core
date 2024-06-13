import fs from 'fs'
import path from 'path'

import pkg from '../package.json' with { type: 'json' }

/** @typedef {import('../package.json')} Package */

/**
 * @param {Package} pkg - The root package.json file
 */
function createPackageJson(pkg) {
  return {
    name: pkg.name,
    version: pkg.version,
    description: pkg.description,
    author: pkg.author,
    license: pkg.license,
    main: './index.js',
    types: './index.d.ts',
  }
}

const filesToCopy = [
  'README.md',
  'CHANGELOG.md',
  'LICENSE',
  'VERSION',
  '.npmignore',
]

function main() {
  const root = path.resolve(import.meta.dirname, '..')

  const packageJson = createPackageJson(pkg)
  const packageJsonString = JSON.stringify(packageJson, null, 2)

  fs.writeFileSync(path.resolve(root, 'dist/package.json'), packageJsonString)

  for (const file of filesToCopy) {
    const source = path.resolve(root, file)

    if (fs.existsSync(source)) {
      fs.copyFileSync(source, path.resolve(root, 'dist', file))
    }
  }
}

main()
