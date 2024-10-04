import fs from 'fs'
import path from 'path'

import pkg from '../package.json' with { type: 'json' }

/** @typedef {import('../package.json')} Package */

/**
 * @satisfies {(keyof Package)[]}
 */
const copiedFields = [
  'name',
  'version',
  'description',
  'keywords',
  'bugs',
  'license',
  'author',
  'contributors',
  'repository',
  'peerDependencies',
]

/**
 * @param {Package} pkg - The root package.json file
 * @returns {Pick<Package, (typeof copiedFields)[number]> & { main: string; types: string }} The constructed package.json file
 */
function createPackageJson(pkg) {
  const packageJson = {
    main: './index.js',
    types: './index.d.ts',
  }

  for (const field of copiedFields) {
    if (field in pkg) {
      packageJson[field] = pkg[field]
    }
  }

  return packageJson
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
