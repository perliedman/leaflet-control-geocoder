#!/usr/bin/env node
// Prepends the commits since the last tag to CHANGELOG.md.
// The heading is the package.json version if it isn't tagged yet, "Unreleased" otherwise.
// Usage: node scripts/changelog.js [--dry-run]
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';

const git = (...args) => execFileSync('git', args, { encoding: 'utf8' }).trim();
const file = new URL('../CHANGELOG.md', import.meta.url);
const pkg = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
const repo = pkg.repository.url.replace(/^git(\+https)?:\/\//, 'https://').replace(/\.git$/, '');

const tag = git('describe', '--tags', '--abbrev=0');
const version = pkg.version === tag ? 'Unreleased' : pkg.version;
const date = new Date().toLocaleDateString('sv-SE'); // local YYYY-MM-DD
const commits = git('log', `${tag}..HEAD`, '--no-merges', '--reverse', '--format=%h %s')
  .split('\n')
  .filter(line => line && !/^\S+ v?\d+\.\d+\.\d+$/.test(line)) // skip version bumps
  .map(line => {
    const [, hash, subject] = line.match(/^(\S+) (.*)$/);
    return `- ${subject} ([${hash}](${repo}/commit/${hash}))`;
  });

const section = `## ${version} (${date})\n\n${commits.join('\n')}\n`;
if (process.argv.includes('--dry-run')) {
  process.stdout.write(section);
} else {
  // replace a previously generated section for the same heading
  const changelog = readFileSync(file, 'utf8').replace(
    new RegExp(`^## ${version.replace(/\./g, '\\.')} \\(.*?\\n(?=## )`, 's'),
    ''
  );
  writeFileSync(file, `${section}\n${changelog}`);
}
