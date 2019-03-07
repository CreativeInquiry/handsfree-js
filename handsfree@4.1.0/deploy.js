/**
 * Helper script for building and deploying
 * Deploys out of /dist/
 */

// 👉🏻 CONFIG
// Set this to the repo to deploy to
const gitRepo = 'https://github.com/handsfreejs/docs'
// Adds a CNAME record with this value if present, or ignores it
const domainName = 'handsfree.js.org'

// build
const pckg = require('./package.json')
const shell = require('shelljs')
shell.exec('npm run build')

// navigate into the build output directory
shell.cd('dist')

// if you are deploying to a custom domain
shell.exec(`echo ${domainName} > CNAME`)

shell.exec('git init')
shell.exec('git add -A')
shell.exec(`git commit -m "deploy docs for ${pckg.version}"`)

// if you are deploying to https://<USERNAME>.github.io
// git push -f git@github.com:<USERNAME>/<USERNAME>.github.io.git master

// if you are deploying to https://<USERNAME>.github.io/<REPO>
shell.exec(`git remote add origin ${gitRepo}`)
shell.exec('git push origin master:gh-pages -f')

shell.cd('-')
