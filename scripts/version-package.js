import path from 'path'
import fs from 'fs'
import { execSync } from 'child_process'

const prereleaseTags = {
  alpha: 'alpha',
  beta: 'beta',
  rc: 'rc',
}

const [, , versionType, preType] = process.argv

function main() {
  const root = path.resolve(import.meta.dirname, '..')

  if (versionType === 'prerelease') {
    const tag = prereleaseTags[preType]

    if (!tag) {
      console.error('Invalid prerelease tag')
      process.exit(1)
    }

    execSync(`npm version prerelease --preid=${tag}`)
  } else if (!['major', 'minor', 'patch'].includes(versionType)) {
    console.error('Invalid version type')
    process.exit(1)
  }

  execSync(`npm version ${versionType}`)

  const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json')))

  fs.writeFileSync(path.join(root, 'VERSION'), pkg.version)
}

main()
