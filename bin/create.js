const path = require('path')
const fs = require('fs-extra')
const inquirer = require('inquirer')
const Generator = require('./Generator')

module.exports = async function createJs (name, option) {
  // 当前执行命令的目录
  const cwd = process.cwd();
  // 需要创建的目录地址
  const targetDir = path.join(cwd, name)
  // 判断目录是否已经存在
  if (fs.existsSync(targetDir)) {
    // 是否有强制覆盖选项:有则删除原有的
    if (option.Force) {
      await fs.remove(targetDir)
    } else {
      // TODO： 没有强制覆盖参数，询问用户做出选择
      let { action } = await inquirer.prompt([
        {
          name: 'action',
          type: 'list',
          message: 'Target directory already exists Pick an action:',
          choices: [
            {
              name: 'Overwrite',
              value: 'overwrite'
            },
            {
              name: 'Cancel',
              value: false
            },
          ]
        }
      ])
      if (!action) return;
      if (action === 'overwrite') {
        console.log(`\r\nRemoving...`)
        await fs.remove(targetDir)
      }
    }
  }

  // 创建项目
  const generator = new Generator(name, targetDir);

  // 开始创建项目
  generator.create()
}