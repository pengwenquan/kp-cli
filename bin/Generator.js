const { getRepoList, getTagList } = require('./http');
const ora = require('ora');
const inquirer = require('inquirer');
const util = require('util');
const downloadGitRepo = require('download-git-repo'); // 不支持 Promise
const path = require('path');
const chalk = require('chalk')

async function wrapLoading(fn, message, ...args) {
  const spinner = ora(message);
  // 开始加载动画
  spinner.start();

  try {
    const result = await fn(...args);
    // 状态修改成功
    spinner.succeed();
    return result;
  } catch (error) {
    spinner.fail('Request failed, refetch ...')
  }
}

class Generator {
  constructor (name, targetDir){
    // 目录名称
    this.name = name;
    // 创建位置
    this.targetDir = targetDir;
    // 对 download-git-repo 进行 promise 化改造
    this.downloadGitRepo = util.promisify(downloadGitRepo);
  }

  async getRepo() {
    const repoList = await wrapLoading(getRepoList, 'waiting fetch template');
    if (!repoList) return;
    // 过滤我们需要的模板名称
    const repos = repoList.map(item => item.name);
     // 让用户自己选择相依那个的模板
     const { repo } = await inquirer.prompt({
       name: 'repo',
       type: 'list',
       choices: repos,
       message: 'please choose a template to create project'
     })

     // 返回用户的选择
     return repo;
  }
  // 获取版本tag
  async getTag(repo) {
    const tagList = await wrapLoading(getTagList, 'waiting fetch tag', repo);
    if (!tagList) return;
    // 过滤我们需要的tag名称
    const tags = tagList.map(item => item.name);
     // 让用户自己选择相依那个的tag
     const { tag } = await inquirer.prompt({
       name: 'tag',
       type: 'list',
       choices: tags,
       message: 'please choose a tag to create project'
     })

     // 返回用户的选择
     return tag;
  }

  // 下载远程模板
  async downloadTemp(repo, tag) {
    // 拼接下载地址
    const requestUrl = `zhurong-cli/${repo}${tag?'#'+tag:''}`;
    // 下载
    await wrapLoading(
      this.downloadGitRepo, // 远程下载方法
      'waiting download template', // 加载提示信息
      requestUrl, // 参数1: 下载地址
      path.resolve(process.cwd(), this.targetDir)) // 参数2: 创建位置
  }

  // 核心创建逻辑
  // 1、获取模板名称
  // 2、获取tag名称
  // 3、下载模板到模板目录
  async create(){
    // 获取模板名称
    const repo = await this.getRepo()
    const tag = await this.getTag(repo)
    console.log(`用户选择了，repo=${repo}, tag=${tag}`)

    // 3）下载模板到模板目录
    await this.downloadTemp(repo, tag)
    
    // 4）模板使用提示
    console.log(`\r\nSuccessfully created project ${chalk.cyan(this.name)}`)
    console.log(`\r\n  cd ${chalk.cyan(this.name)}`)
    console.log('  npm run dev\r\n')
  }
}

module.exports = Generator;
