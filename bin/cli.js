#! /usr/bin/env node

const program = require('commander')
const create = require('./create')
const chalk = require('chalk')
const figlet = require('figlet')

// 配置create命令
program
  .command('create <app-name>')
  .description('create a new project')
  // -f or -force 为强制创建，如果创建的目录存在则直接覆盖
  .option('-f, -force', 'overwrite target directory if it exist')
  .option('-s', 'save again')
  .action((name, option) => {
    console.log('name:',name, 'option:',option)
    create(name, option)
  })

// 配置config命令
program
  .command('config [value]')
  .description('inspect and modify the config')
  .option('-g, --get <path>', 'get value from option')
  .option('-s --set <path> <value>')
  .option('-d, --delete <path>', 'delete option from config')
  .action(() => {
    console.log(value, option)
  })

// 配置 ui 命令
program
  .command('ui')
  .description('start add open roc-cli ui')
  .option('-p, --port <port>', 'Port used for the UI Server')
  .action((option) => {
    console.log(option)
  })
program
  // 监听 --help 执行
  .on('--help', () => {
    // 使用 figlet 绘制 Logo
    console.log('\r\n' + figlet.textSync('zhurong', {
      font: 'Ghost',
      horizontalLayout: 'default',
      verticalLayout: 'default',
      width: 80,
      whitespaceBreak: true
    }));
    // 新增说明信息
    console.log(`\r\nRun ${chalk.cyan(`zr <command> --help`)} for detailed usage of given command\r\n`)
  })

program
  .version(`v${require('../package.json').version}`)
  .usage('<command> [option]')

program.parse(process.argv);