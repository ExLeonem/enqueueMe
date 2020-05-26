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
        this.defaults = definitions._defaults_ || {};
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

        let response = this.responses[name];
        let prevArguments = Object.keys(arguments).sort().slice(1).map(index => arguments[index]);
        return this.formatResponse(response, ...prevArguments); 
    }


    /**
     * Returns a default reponse.
     * 
     * @param {*} name 
     * @return {string} Reponse with template sequences replaced.
     */
    getDefaults(name) {

        let response = this.defaults[name];
        let prevArguments = Object.keys(arguments).sort().slice(1).map(index => arguments[index]);
        return this.formatResponse(response, ...prevArguments);
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
    formatResponse(text) {

        // Tokens of undefined text can't be replaced.
        if (!text) {
            throw "(Error in command.js/_formatResponse) Can't replace tokens of undefined String.";
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
            let userId = message.author.id;
            type.repsonse = this.getDefaults("directMessage", userId);
            type.direct = true;

        }

        return type; 
    }


     /**
     * Get information about the channel the user is communicating over.
     * 
     * Return Example:
     *  {
     *      isBotChannel: true, // the channel to be used for communication
     *      response: "Response in case channel does not exist" // Error message if it is not.
     * }
     * 
     * @param {Object} message The received discord.js message object
     * @param {boolean} admin Indicator to check for admin or member channel
     * @return {Object} Object describing the check result
     */
    getChannelInfo(message, admin = false) {

        // Object to return
        let channelResult = {
            isBotChannel: false,
            name: "",
            response: ''
        };

        // Block direct message
        let messageType = this.isDirect(message);
        if (messageType.direct) {
            return this.getResponse(messageType.response); 
        }

        // Bot communication now allowed on current channel
        let category = message.channel.parent;
        let inCategory = false;
        if (channels.category == category.name) {
            inCategory = true;
            channelResult.category = category.name;

        }

        // Check the server specific channel configured via storage.set
        let guildId = message.guild.id;
        let configuredChannelName = this.storage.get("config." + guildId + ".channels." + (admin ? "admin" : "member"));
        let channelInCat = this.__channelInCategory(message, configuredChannelName, category.name);
        if (channelInCat && inCategory) {
            channelResult.isBotChannel = true;
            channelResult.name = configuredChannelName;
            return channelResult;

        }

        // Channel is under category but not 
        let categoryExists = this.__categoryExists(message, category.name);
        if (channelInCat) {
            
            channelResult.response = categoryExists ? 
                this.getDefaults("messageNotOnCategory", message.member.id, channels.member, channels.category) : 
                this.getResponse("categoryNonExistent", message.member.id, category.name);

            return channelResult;
        }


        // Check the default channel configured in config.js
        let defaultChannelName = admin ? channels.admin : channels.member;
        channelInCat = this.__channelInCategory(message, defaultChannelName, category.name); 
        if (channelInCat && inCategory) {
            channelResult.isBotChannel = true;
            channelResult.name = defaultChannelName;
            return channelResult;

        }

        // Neither default nor configured channel do exist
        channelResult.response = this.getDefaults("channelConfig");
        return channelResult;
    }


    /**
     * Check if given category is configured on the server
     * 
     * @param {*} message A discord.js message object
     * @param {string} channelName Name of the channel to look for
     * @param {string} categoryName Name of the category to look for
     * @return {boolean} true | false
     */
    __channelInCategory(message, channelName, categoryName) {

        // Prevent check if channel name or category name empty
        if (!channelName || !categoryName) {
            return false;
        }

        let callback = channel => {
            let channelNameEquals = channel.name.toLowerCase() == channelName.toLowerCase() ;
            let parentEquals = channel.parent && channel.parent.name.toLowerCase() == categoryName.toLowerCase();
            return channelNameEquals && parentEquals;
        };

        // Search for configured channel/category combination
        let result = message.guild.channels.cache.find(callback);
        if (!result) {
            return false;
        }

        return true;
    }


    /**
     * Check if any channel exists under given category name
     * 
     * @param {*} message A discord.js message object
     * @param {*} categoryName The name of the category
     * @return {boolean} true | false
     */
    __categoryExists(message, categoryName) {

        // Prevent check if category name empty
        if (!categoryName) {
            return false;
        }

        let callback = channel => {
            return channel.parent && channel.parent.name.toLowerCase() == categoryName.toLowerCase()
        };

        let result = message.guild.channels.cache.find(callback);
        if (!result) {
            return false;
        }

        return true;
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