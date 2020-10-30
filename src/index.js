const minimist = require('minimist');
const defaulter = require('./defaulter');
const scanner = require('sonarqube-scanner');

exports.run = async () => {
    console.log('===== SONARCLOUD SCAN STARTED =====');
    const args = minimist(process.argv.slice(2));
    await defaulter.applyDefaults(args);
    scanner(
        {
            serverUrl: args.server,
            token: args.token,
            options: args.sonar
        },
        () => {
            console.log('===== SONARCLOUD SCAN FINISHED =====');
            process.exit();
        }
    );
};
