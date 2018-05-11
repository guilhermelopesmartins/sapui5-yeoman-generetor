'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');

module.exports = class extends Generator {
  prompting() {
    // Have Yeoman greet the user.
    this.log(
      yosay(`Welcome to the fabulous ${chalk.red('generator-sapui-5-webapp')} generator!`)
    );

    const prompts = [
      {
        type: 'input',
        name: 'appName',
        message: 'Informe o nome do projeto:',
        default: "MyUI5WebApp"
      },
      {
        type: 'input',
        name: 'appDescription',
        message: 'De uma descrição curta sobre o aplicativo:',
        default: "Descrição do aplicativo"
      }
    ];

    return this.prompt(prompts).then(props => {
      // To access props later use this.props.someAnswer;
      this.props = props;
    });
  }

  writing() {
    console.log(this.props)
    this.fs.copyTpl(
      this.templatePath('ui5/**/*'),
      this.destinationPath(this.destinationRoot()+'/../projects/'+this.props['appName']), this.props,
      undefined,
      { globOptions: { dot: true } }
    );
  }

  install() {
    this.installDependencies();
  }
};
