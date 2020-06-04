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
 * 
 * @param {Object} config Content of the configuration file
 */
function writeConfig(config) {

    let content = JSON.stringify(config);
    fs.writeFileSync(configFile, content);
}


/**
 * Remove files inside the data directory
 */
function cleanupDir() {
    
    let dataPath = path.join(process.cwd(), "data");

    if (!fs.existsSync(dataPath)) {
        return;

    }

    let dirContent = fs.readdirSync(dataPath, {"withFileTypes": true});
    dirContent.forEach((element) => {

        let itemPath = path.join(dataPath, element.name);
 
        // Clean-up json files from directory
        if (element.isFile()) {
            fs.unlinkSync(itemPath);

        }
    });

    fs.rmdirSync(dataPath);
}





module.exports = {
    getConfig,
    writeConfig,
    cleanupDir
}