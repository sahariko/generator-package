require('colors');

const fs = require('fs');
const path = require('path');
const Generator = require('yeoman-generator');

const NAME = 'name';
const SCOPED = 'scoped';
const DESCRIPTION = 'description';

const TEMPLATE_PATH = path.resolve(__dirname, './template');

const QUESTIONS = [
    {
        type: 'input',
        name: NAME,
        message: 'Package Name:',
        validate: (val) => Boolean(val)
    },
    {
        type: 'input',
        name: DESCRIPTION,
        message: 'Description:'
    },
    {
        type: 'confirm',
        name: SCOPED,
        message: 'Should the package be scoped?',
        default: false
    }
];

module.exports = class extends Generator {
    async prompting() {
        // this.answers = await this.prompt(QUESTIONS);
        this.answers = {
            name: 'sahar',
            description: 'asd',
            scoped: true
        };
    }

    configuring() {
        fs.mkdirSync(this.answers.name);
        this.sourceRoot(TEMPLATE_PATH);
        this.destinationRoot(`./${this.answers[NAME]}`);
    }

    writing() {
        const defaultArgs = [
            this.destinationPath(),
            this.answers,
            {},
            {
                dot: true,
                onlyFiles: false
            }
        ];

        this.fs.copyTpl(
            this.templatePath(),
            ...defaultArgs
        );

        this.fs.copyTpl(
            this.templatePath('.*'),
            ...defaultArgs
        );
    }

    install() {
        // this.installDependencies({
        //     npm: true,
        //     bower: false
        // });

        this.spawnCommandSync('cwd', [this.destinationRoot()]);
        this.spawnCommandSync('git', ['init']);
        this.spawnCommandSync('git', ['remote', 'add', 'origin', `git@github.com:sahariko/${this.answers.name}.git`]);
        this.spawnCommandSync('git', ['add', '--all']);
        this.spawnCommandSync('git', ['commit', '-m', 'Project initialization']);
    }

    end() {
        console.log('All done!'.green.bold);
    }
};
