#!/usr/bin/env node
'use strict';
const CLI = Object.keys(require('./package.json').bin)[0];
const version = require('./package.json').version;
const shell = require('shelljs');
const program = require('commander');
const chalk = require('chalk');
const makeComponent = require('./scripts/make-component');
const makeExportLists = require('./scripts/make-export-lists');

/* TEXT STYLES */
const desc = text => console.log(' ' + chalk.cyan.bold(text));
const cmd = text => console.log(' ' + chalk.yellow(text));
const info = text => console.log(' ' + chalk.blue(text));
const br = () => console.log('');

/* DOCUMENTATION */
const COMMANDS = {};
const HELP = {};
const EXAMPLES = {};

/* INTERPRETER */
function command(name, description, command, example = () => ('')) {
  COMMANDS[name] = command;
  HELP[name] = description;
  EXAMPLES[name] = example;
}
function handler(action) {
  const script = COMMANDS[action];
  if (script) {
    shell.exec(script(action));
  }
  else {
    desc(`Command not found: ${chalk.red(CLI + ' ' + action)}`)
    desc(`Run ${chalk.yellow(CLI + ' help')} for a list of available commands.`)
  }
}

/* COMMANDS */
function help() {
  br()
  Object.keys(HELP).map(name => {
    desc(`${HELP[name]}`);
    cmd(`${CLI} ${name}`);
    br();
    if (EXAMPLES[name]) EXAMPLES[name]();
  });
  return 'echo ';
};
function setup() {
  const dependencies = [
    'chalk',
    'iterm2-tab-set',
    'nodemon',
    'serve',
    'ttab',
  ].join(' ');
  return `
    brew install yarn \
    && yarn global add ${dependencies} --prefix /usr/local \
    && yarn install \
    && ${CLI} dev
  `;
}
function dev() {
  return `
    ttab 'tabset --color crimson && npm test' \
    && ttab 'tabset --color paleturquoise && npm start' \
    && ttab 'tabset --color springgreen && ${CLI} e -w' \
    && tabset --color whitesmoke \
    && echo ${ chalk.cyan.bold('Run ' + chalk.yellow(CLI + ' help') + ' for a full list of commands.') }
  `;
}
function exports() {
  let cmd = `echo You must specify a flag to perform component operations.`;
  if (program.component) {
    const name = program.component[0].toUpperCase() + program.component.slice(1);
    info(`Creating new component "${name}"...`);
    makeComponent(name);
    info(`Component created: "${name}"`);
    cmd = 'echo ';
  }
  if (program.list) {
    info('Creating export lists...');
    makeExportLists();
    info('Export lists created.');
    cmd = 'echo ';
  }
  if (program.build) cmd = `${CLI} e -l && NODE_ENV=production webpack --config config/webpack.config.exports.js`;
  if (program.serve) cmd = `serve .dist`;
  if (program.watch) cmd = `nodemon --exec '${CLI} e -b && ${CLI} e -s' --watch src/export/components -e js,sass`;
  return cmd;
}

/* EXAMPLES */
function exportsExamples() {
  desc(`Add new export component (outputs /src/export/${chalk.red('MyComponent')}/..)`);
  cmd(`${CLI} exports -c MyComponent`);
  cmd(`${CLI} exports --component MyComponent`);
  br();
  desc('Build export assets (outputs /.dist)');
  cmd(`${CLI} exports -b`);
  cmd(`${CLI} exports --build`);
  br();
  desc('Build export lists (outputs /.exports.json, /src/export/components.js, demos.js, docs.js, style.js)');
  cmd(`${CLI} exports -l`);
  cmd(`${CLI} exports --list`);
  br();
  desc('Start exports server');
  cmd(`${CLI} exports -s`);
  cmd(`${CLI} exports --serve`);
  br();
  desc('Start exports watcher');
  cmd(`${CLI} exports -w`);
  cmd(`${CLI} exports --watch`);
  br();
}

command('help', 'Show available commands', help);
command('h', 'Shorthand help command', help);
command('setup', 'Set up the dev toolchain', setup);
command('dev', 'Run dev toolchain', dev);
command('exports', 'Asset export operations (must specify a flag)', exports, exportsExamples);
command('e', 'Shorthand exports command', exports);

/* Boom Shakalaka */
program
.version(version)
.arguments('<action>')
.description('Audi CLI for React component development')
.option('-c, --component <component>', 'Add a component.')
.option('-b, --build',                 'Build exported assets (to /.dist).')
.option('-l, --list',                  'Generate exports entries list (to /.exports.json).')
.option('-s, --serve',                 'Serve compiled export assets.')
.option('-w, --watch',                 'Watch export assets (recompile/serve on file changes).')
.action(handler)
.parse(process.argv);
