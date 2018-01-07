const package = require('./package.json');

module.exports = {
    workingDirectory: __dirname,
    name: package.name,
    version: package.version,
    description: package.description,
    watchingFolder: __dirname + '/test/',
    databaseFolder: ''
}
