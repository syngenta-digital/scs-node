const fs = require('fs');
const YAML = require('yaml');
const slugify = require('slugify');
const invalidCharacterRegex = /[?$*+~.()'"!:@/]/g;

const _configureFromFlags = async (args) => {
    args.sonar['sonar.projectKey'] = slugify(args.key, {
        remove: invalidCharacterRegex
    });
    args.sonar['sonar.projectName'] = args.name;
    args.sonar['sonar.projectVersion'] = args.version;
    args.sonar['sonar.projectDescription'] = args.description;
    args.sonar['sonar.sources'] = args.sources;
    args.sonar['sonar.exclusions'] = args.exclusions;
    args.sonar['sonar.tests'] = args.tests;
    args.sonar['sonar.scm.provider'] = args.provider;
    args.sonar['sonar.links.homepage'] = args.homepage;
    args.sonar['sonar.links.issues'] = args.issues;
    args.sonar['sonar.links.scm'] = args.scm;
};

const _configureFromPackage = async (args) => {
    const jsonFile = await fs.readFileSync('package.json', 'utf8');
    const pkg = await JSON.parse(jsonFile);
    args.sonar['sonar.projectKey'] = slugify(pkg.name, {
        remove: invalidCharacterRegex
    });
    args.sonar['sonar.projectName'] = pkg.name;
    args.sonar['sonar.projectVersion'] = pkg.version;
    if (pkg.description) {
        args.sonar['sonar.projectDescription'] = pkg.description;
    }
    if (pkg.main) {
        args.sonar['sonar.sources'] = pkg.main.split('/')[0];
    }
    if (pkg.homepage) {
        args.sonar['sonar.links.homepage'] = pkg.homepage;
    }
    if (pkg.bugs && pkg.bugs.url) {
        args.sonar['sonar.links.issues'] = pkg.bugs.url;
    }
    if (pkg.repository && pkg.repository.url) {
        args.sonar['sonar.links.scm'] = pkg.repository.url;
        args.sonar['sonar.scm.provider'] = pkg.repository.type;
    }
    if (await fs.existsSync('node_modules')) {
        args.sonar['sonar.exclusions'] = 'node_modules';
    }
};

const _configureFromFile = async (args) => {
    const ymlFile = await fs.readFileSync(`${args.file}`, 'utf8');
    const yml = await YAML.parse(ymlFile);
    const {sonar} = yml;
    if (yml.serverUrl) {
        args.server = yml.serverUrl;
    }
    if (yml.token && !args.token) {
        args.token = yml.token;
    }
    if (yml.organization && !args.organization) {
        args.sonar['sonar.organization'] = yml.organization;
    }
    args.sonar['sonar.projectKey'] = slugify(sonar.projectKey, {
        remove: invalidCharacterRegex
    });
    args.sonar['sonar.projectName'] = sonar.projectName;
    args.sonar['sonar.projectVersion'] = sonar.projectVersion;
    args.sonar['sonar.projectDescription'] = sonar.projectDescription;
    args.sonar['sonar.sources'] = sonar.sources;
    args.sonar['sonar.exclusions'] = sonar.exclusions;
    args.sonar['sonar.tests'] = sonar.tests;
    if (sonar.scm) {
        args.sonar['sonar.scm.provider'] = sonar.scm.provider;
    }
    if (sonar.links) {
        args.sonar['sonar.links.homepage'] = sonar.links.homepage;
        args.sonar['sonar.links.issues'] = sonar.links.issues;
        args.sonar['sonar.links.scm'] = sonar.links.scm;
    }
};

const _configureSettings = async (args) => {
    if (args.file) {
        await _configureFromFile(args);
    } else if (args.key) {
        await _configureFromFlags(args);
    } else if (await fs.existsSync('package.json')) {
        await _configureFromPackage(args);
    } else {
        throw new Error('Must provide config file, flags or have a package.json at root of project');
    }
};

exports.applyDefaults = async (args) => {
    console.log('APPLYING CONFIGURATIONS');
    args.token = process.env.SONAR_TOKEN || args.token;
    args.server = args.server || 'https://sonarcloud.io';
    args.sonar = {
        'sonar.organization': process.env.SONAR_ORG || args.org
    };
    await _configureSettings(args);
    console.log('FINISHED APPLYING CONFIGURATIONS');
};
