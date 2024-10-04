import path from 'path'
import fs from 'fs'
import { execSync } from 'child_process'

/** @typedef {import('../package.json')} Package */

const validPrereleaseTags = {
  alpha: 'alpha',
  beta: 'beta',
  rc: 'rc',
}

const validVersionTypes = ['major', 'minor', 'patch', 'prerelease']

const [, , versionType, preType] = process.argv

function main() {
  const root = path.resolve(import.meta.dirname, '..')

  if (!validVersionTypes.includes(versionType)) {
    console.error('Invalid version type')
    process.exit(1)
  }

  if (versionType === 'prerelease') {
    const tag = validPrereleaseTags[preType]

    if (!tag) {
      console.error('Invalid prerelease tag')
      process.exit(1)
    }

    execSync(`npm version prerelease --preid=${tag} --no-git-tag-version`)
  }

  execSync(`npm version ${versionType}`)

  /** @type {Package} */
  const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json')))

  fs.writeFileSync(path.join(root, 'VERSION'), pkg.version)

  execSync('git add VERSION package.json package-lock.json')
  execSync(`git commit -m "chore(version): bump to v${pkg.version}"`)
}

main()
