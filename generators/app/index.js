'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');

module.exports = class extends Generator {
  prompting() {
    this.log(yosay(`Bem vindo ao Magnífico ${chalk.red('generator-sapui-5-webapp')}!`));

    const prompts = [
      {
        type: 'input',
        name: 'appName',
        message: 'Informe o nome do projeto:',
        default: 'MyUI5WebApp'
      },
      {
        type: 'input',
        name: 'shortName',
        message: 'Informe o nome curto para o atalho da PWA (progressive Web App)',
        default: 'Invent'
      },
      {
        type: 'input',
        name: 'appDescription',
        message: 'De uma descrição curta sobre o aplicativo:',
        default: 'Descrição do aplicativo'
      },
      {
        type: 'input',
        name: 'companyLink',
        message: 'link do site da empresa',
        default: 'http://inventsoftware.com.br'
      }
    ];

    return this.prompt(prompts).then(props => {
      // To access props later use this.props.someAnswer;
      this.props = props;
    });
  }

  writing() {
    console.log(this.props);
    this.fs.copyTpl(
      this.templatePath('ui5/**/*'),
      this.destinationPath(this.destinationRoot() + '/' + this.props.appName),
      this.props,
      undefined,
      { globOptions: { dot: true } }
    );
  }
};
