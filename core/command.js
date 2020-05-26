const definitions = require('../commands/definitions.json');
const { channels, adminRole } = require('../config');


/**
 * Parent class of every command.
 * Defines general api of a command.
 * 
 * @author Maksim Sandybekov
 * @date 10.05.2020
 */
class Command {

    /**
     * 
     * @param {String} name - name of the command
     * @param {Object} params - additional paramters
     */
    constructor(name, params = {}) {
        let command = definitions[name] || "";

        this.name = command.name || name;
        this.responses = command.responses || {};
        this.defaults = definitions.__defaults__ || {
            "channelConfig": "",
            "directMessage": ""
        };
        this.params = params;
    }


    /**
     * Returns a message to the user
     * 
     * @param {*} message A message object to interact with the user.
     * @param {*} args Arguments passed with previous command.
     * @param {Object} client A reference to the discord.js client object
     */
    execute(message, args) {
        return message.channel.send("Execute template");
    }
    

    /**
     * Creates and returns a object representation of the command. Used to init discord.js commands.
     *  
     * @return {Object}
     */
    getCommand() {

        let commandObject = this;

        return {
            name: this.name,
            ...this.params,
            execute(message, args) {
                return commandObject.execute(message, args);
            }
        }
    }


    /**
     * Access and return the command name.
     * 
     * @return {string}
     */
    getName() {
        return this.name;
    }


    /**
     * Returns a command specific response for a user, additionally supplied arguments besides name are used to replace template sequeuence of the string.
     * Example: getReponse("welcome", "Hello", "Max") => will get the "welcome" response under the calling command and replace {0} with "Hello" and {1} with "Max"
     * 
     * @param {*} name The key of the response. Used to access the responses for the calling command.
     * @return {string} Reponse with template sequences replaced.
     */
    getResponse(name) {

        // No response under given key
        let response = this.responses[name];
        let prevArguments = Object.keys(arguments).sort().slice(1).map(index => arguments[index]);
        return this._formatReponse(response, ...prevArguments);
    }


    /**
     * Returns a default reponse.
     * 
     * @param {*} name 
     * @return {string} Reponse with template sequences replaced.
     */
    getDefaults(name) {

        let reponse = this.defaults[name];
        let prevArguments = Object.keys(arguments).sort().slice(1).map(index => arguments[index]);
        return this._formatReponse(reponse, ...prevArguments);
    }


    /**
     * Performs replacement of template sequences in a reponse text, using arguments passed besides text.
     * {0} => replaced by arugments[1]
     * {1} => replaced by arguments[2]
     * ...
     * 
     * @param {*} text The response text, which may include template sequences of form {0}, {1}, ...
     * @return {string} The reponse text with replaced template sequences.
     */
    _formatReponse(text) {

        // Tokens of undefined text can't be replaced.
        if (!text) {
            throw "(Error in command.js/_formatReponse) Can't replace tokens of undefined String.";
        }

         // Replace keys in string 
         let argumentKeys = Object.keys(arguments).sort().slice(1).map(paramIndex => parseInt(paramIndex)-1);
         let result = text;
         for (let key of argumentKeys) {
             result = result.replace(new RegExp("\\{" + key + "\\}", 'g'), arguments[key+1]);
 
         }

         return result;
    }


    /**
     * Check if message received was direct a message.
     * 
     * Return Example:
     * {
     *  exists: false,
     *  reponse: "Some reponse text in case it does not exist"
     * }
     * 
     * @param {*} message  A discord.js message object
     * @return {Object} Object describing the check result
     */
    isDirect(message) {
         
        let type = {
            direct: false,
            response: ""
        };

        if (!message.member) {
            type.repsonse = "";
            type.direct = true;
        }

        return type; 
    }


     /**
     * Check if either one of the configured channels exists and return an object to check upon.
     * 
     * Return Example:
     *  {
     *      exists: true,
     *      name: "name of the channel",
     *      response: "Response in case channel does not exist"
     * }
     * 
     * @param {Object} message The received discord.js message object
     * @param {boolean} admin Indicator to check for admin or member channel
     * @return {Object} Object describing the check result
     */
    getChannel(message, admin = false) {

        let channel = {
            exists: false,
            name: "",
            response: ""
        };

        let category = message.channel.parent;

        // Check the server specific channel configured via storage.set
        let guildId = message.guild.id;
        let configuredChannelName = this.storage.get("config." + guildId + ".channels." + (admin ? "admin" : "member")) || undefined;

        console.log("found: " + !message.guild.channels.cache.find(guildChannel => guildChannel.name == configuredChannelName))
        let configuredExists = !message.guild.channels.cache.find(guildChannel => guildChannel.name == configuredChannelName) && configuredChannelName != undefined ? true: false;

        if (configuredExists) {
            console.log("found configured");

            channel.exists = true;
            channel.name = configuredChannelName;
            return channel;
        }

        // Check the default channel configured in config.js
        let defaultChannelName = admin ? channels.admin : channels.member;
        let defaultExists = !message.guild.channels.cache.find(guildChannel => guildChannel.name == defaultChannelName) && defaultChannelName != undefined ? true: false;

        if (defaultExists) {
            console.log("found default");

            channel.exist = true;
            channel.name = defaultChannelName;
            return channel;
        }

        // Neither default nor configured channel do exist
        channel.response = this.getDefaults("channelConfig");
        return channel;
    }


    /**
     * 
     * @param {*} message 
     * @param {string} category
     * 
     * 
     */
    __categoryExists(message, category) {

    }


    /**
     * Return command description.
     * 
     * @return {string}
     */
    getDescription() {
        return this.getDescription;
    }
}

module.exports = Command;