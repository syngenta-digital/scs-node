# SonarCloud Scan (SCS)
Simple NPX package to run sonarcloud analysis

## Features

* Ability to run a sonarcloud scan in one command
* Supports most use cases and languages
* Support config files in JSON or YML

## Installation & Usage

This is a [Node.js](https://nodejs.org/en/) module available through the
[npm registry](https://www.npmjs.com/).

Before installing, [download and install Node.js](https://nodejs.org/en/download/).
Node.js 0.10 or higher is required.

```bash

# if env variables SONAR_TOKEN & SONAR_ORG are set

$ npx @syngenta-digital/scs

# or you can pass in the flags

$ npx @syngenta-digital/scs --token some-token --org syngenta-dpe-usco --key some-project --name some-project

# or pass in a configuration json

$ npx @syngenta-digital/scs --file some-dir/sonar.json

# or pass in a configuration yml

$ npx @syngenta-digital/scs --file some-dir/sonar.yml
```

### Command Flag Options

Flag Name    | Required | Description
:----------- | :------- | :-----------
`token`      | false    | The token to access sonarcloud (default: SONAR_TOKEN env variable)
`org`        | false    | The sonarcloud org the project belongs to (default: SONAR_ORG env variable)
`file`       | false    | The configuration file relative path
`version`    | false    | The version
`description`| false    | The description
`sources`    | false    | The code source directories; separate by comma if multiple
`exclusions` | false    | The exclusions not to scan
`tests`      | false    | The tests directories
`provider`   | false    | The provider (i.e. git, hg, etc)
`homepage`   | false    | The homepage of project
`issues`     | false    | The issues link
`issues`     | false    | The issues link
`scm`        | false    | The source control management link

### YAML Config File Example

```yml
token: optional-token
organization: some-organization
sonar:
    projectKey: test-project
    projectName: test-name
    projectVersion: 1.0
    projectDescription: test-description
    sources: src
    exclusions: node_modules
    tests: test
    scm:
        provider: git
    links:
        homepage: https://www.test.com
        issues: https://some-issu-url.com
        scm: git+https://some-issu-url.com
```

### JSON Config File Example

```json
{
    "token": "optional-token",
    "organization": "some-organization",
    "sonar": {
        "projectKey": "test-project",
        "projectName": "test-name",
        "projectVersion": 1.0,
        "projectDescription": "test-description",
        "sources": "src",
        "exclusions": "node_modules",
        "tests": "test",
        "scm": {
            "provider": "git"
        },
        "links": {
            "homepage": "https://www.test.com",
            "issues": "https://some-issu-url.com",
            "scm": "git+https://some-issu-url.com"
        }
    }
}
```
