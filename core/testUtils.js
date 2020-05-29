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


/**
 * Mock a discord.js message object to check functionality of the enqueue command.
 * 
 * @param {*} guildId 
 * @param {*} userId 
 * @param {*} findElements 
 * @param {*} currentChannel 
 * 
 * @return {Object} the mocked object
 */
function mockMessage(guildId, userId, findElements, currentChannel) {

    return {
       member: {
           id: userId,
           user: {
               username: "Max Mustermann",
               discriminator: "2324"
           }
       },
       guild:  {
           id: guildId,
           channels: {
               cache: {
                   find: function(callback) {

                       let elements = findElements;
                       for (let element of elements) {
                           
                           if (callback(element)) {
                               return {
                                   ...element,
                                   send: function(content) {
                                       return content;
                                   }
                               };
                           }
                       }
                   }
               }
           }
       },
       channel: {
          ...currentChannel,
           send: function(content) {
               return content;
           }
       }
   }
}


/**
 * Mock a drecit message to the bot.
 * 
 * @param {*} guildId 
 * @param {*} userId 
 * @return {Object} The mock object
 */
function mockDirectMessage(userId, currentChannel = {}) {

    return {
        author: {
            id: userId,
            user: {
                username: "Max Mustermann",
                discriminator: "35234"
            }
        },
        channel: {
            ...currentChannel,
             send: function(content) {
                 return content;
             }
         }
    };
}


module.exports = {
    getConfig,
    writeConfig,
    cleanupDir,
    mockMessage,
    mockDirectMessage
}