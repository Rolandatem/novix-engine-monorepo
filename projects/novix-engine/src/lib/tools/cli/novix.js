#!/usr/bin/env node
/* NovixEngine CLI – Theme Generator */
/*
NovixEngine rebuilds can mess up the link, so if needing to relink do
the following:
- Go to the novix-engine root folder.
- npm unlink -g
- npm link
- *may* need to mark as executable with (in bash):
--chmod +x src/lib/tools/cli/novix.js
*/

const fs = require('fs');
const path = require('path');

function toKebab(input) {
  return String(input)
    .trim()
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase();
}

function ensureThemeSuffix(name) {
  return name.toLowerCase().endsWith('-theme') ? name : `${name}-theme`;
}

function printUsage() {
  console.log(`
Usage:
  novix generate theme <path-or-name> [options]
  novix g theme <path-or-name> [options]

Options:
  --force           Overwrite if file exists
  --no-underscore   Do not prefix the file with "_"
  --id <string>     Override the auto-generated theme id (defaults to <name>-theme)
  --dry-run         Show what would be created without writing files
  -h, --help        Show this help menu
`);
}

function isAbsoluteOrOutsideSrcApp(userPath) {
  return /^(\/|\.\/|\.\.\/|[A-Za-z]:\\|src\/)/.test(userPath);
}

function resolveOutPath(argPath, underscore) {
  let raw = argPath.replace(/\\/g, '/').replace(/\.scss$/i, '');
  let segments = raw.split('/').filter(Boolean);
  let last = segments.pop() || 'theme';

  let kebab = toKebab(last);
  kebab = ensureThemeSuffix(kebab);

  const themeId = kebab;
  const baseDir = isAbsoluteOrOutsideSrcApp(raw) ? '' : 'src/app';
  const dir = baseDir ? path.join(baseDir, ...segments) : path.join(...segments);

  const fileName = `${underscore ? '_' : ''}${kebab}.scss`;
  const fullPath = path.join(dir || '.', fileName);

  return { dir, fileName, fullPath, themeId, name: kebab };
}

function loadTemplate() {
  // Corrected path: up two levels from cli/ to lib/, then into styles/themes
  const templatePath = path.join(__dirname, '../../styles/themes/_novix-theme-template.scss');
  if (!fs.existsSync(templatePath)) {
    console.error('Template not found. Expected at:', templatePath);
    process.exit(1);
  }
  return fs.readFileSync(templatePath, 'utf8');
}

function applyThemeId(template, themeId) {
  return template
    .replace(/\$theme-id:\s*'[^']*';/, `$theme-id: '${themeId}';`)
    .replace(/(\/\/ ID:\s*)[^\n]+/, `$1${themeId}`);
}

function main() {
  const args = process.argv.slice(2);

  // Help flag
  if (args.includes('--help') || args.includes('-h')) {
    printUsage();
    process.exit(0);
  }

  if (args.length < 2) {
    console.error('Error: Missing command or arguments.');
    printUsage();
    process.exit(1);
  }

  const cmd = args[0];
  const sub = args[1];

  if (!/^(g|generate)$/.test(cmd) || sub !== 'theme') {
    console.error(`Error: Unknown command "${cmd} ${sub}".`);
    printUsage();
    process.exit(1);
  }

  const target = args[2];
  if (!target) {
    console.error('Error: Missing <path-or-name> for theme.');
    printUsage();
    process.exit(1);
  }

  const force = args.includes('--force');
  const noUnderscore = args.includes('--no-underscore');
  const dryRun = args.includes('--dry-run');
  const idFlagIndex = args.indexOf('--id');
  const explicitId = idFlagIndex !== -1 ? args[idFlagIndex + 1] : null;

  const { dir, fileName, fullPath, themeId, name } = resolveOutPath(
    target,
    !noUnderscore
  );

  const finalId = explicitId ? explicitId : themeId;

  console.log('Generating theme:');
  console.log('  Name:       ', name);
  console.log('  Theme ID:   ', finalId);
  console.log('  Directory:  ', dir || '.');
  console.log('  File:       ', fileName);
  console.log('  Full path:  ', fullPath);

  if (fs.existsSync(fullPath) && !force) {
    console.error(`Error: File already exists at ${fullPath}. Use --force to overwrite.`);
    printUsage();
    process.exit(1);
  }

  if (dryRun) {
    console.log('Dry run complete. No files written.');
    process.exit(0);
  }

  if (dir && !fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const template = loadTemplate();
  const content = applyThemeId(template, finalId);

  fs.writeFileSync(fullPath, content, 'utf8');

  console.log('\n✅ Success!');
  console.log(`Created ${fullPath}`);
  console.log('\nNext steps:');
  console.log('  1) Register this theme id in NovixEngThemeService.');
  console.log('  2) Ensure @use "novix-engine"; is included in global styles.');
  console.log('  3) Toggle the theme at runtime using the service.');
}

main();
