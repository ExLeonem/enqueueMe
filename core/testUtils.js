const path = require('path');
const fs = require('fs');
const process = require('process');


const configFile = path.join(process.cwd(), "config.json");

/**
 * Read and return the content of the config.json in the project root
 */
function getConfig() {

    let fileContent = fs.readFileSync(configFile);
    return JSON.parse(fileContent);
}


/**
 * Removes previous content of configuration and Write a configuration
 */
function writeConfig(config) {

    let content = JSON.stringify(config);
    fs.writeFileSync(configFile, content);
}



module.exports = {
    getConfig,
    writeConfig
}