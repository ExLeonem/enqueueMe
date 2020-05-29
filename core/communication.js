const Formatter = require('./formatter');
const Storage = require('./storage');
const { channels, adminRole } = require('../config.json');
const definitions = require('../commands/definitions.json');

/**
 * Get information depending the client communication.
 * Checkers to keep communication on the wanted channels
 * 
 * @author Maksim Sandybekov
 * @date 29.05.20202
 * 
 * @class
 * @property {string} message The discord.js communication object to be used.
 */
class Communication {


    constructor(message) {
        this.storage = Storage.getInstance();
        this.defaults = definitions._defaults_ || {};
        this.message = message;
        
        this.setChannelConfigs();
    }


    /**
     * Check if the communication over given channel name and category is allowed, for member/admin users.
     * Category configuration allows for string or array of strings.
     * Member configuration allows for string, array of strings or array of objects with {"name": "string", "category": "string"}
     * Admin configuration allows for string, array of strings or array of objects with {"name": "string", "category": "string"}
     * 
     * @param {*} channelName The name of the channel the client tries to contact the bot.
     * @param {*} categoryName Name of the category under which the channel sits.
     * @param {*} admin If the communication is for admins only
     * @return {boolean} Whether the user is able to communicate over given channel/category/rights
     */
    isAllowed(channelName, categoryName, admin = false) {

        let config = admin ? this.admin : this.member;

        // No configuration for amdin/member given  check if category is configured
        if (!config) {
            return this.__categoriesMatch(categoryName);

        }

        
        // Configured multiple channels, check all
        if (this.isArray(config)) {

            let found = false;
            for (let i = 0; i < config.length; i++) {

                let element = config[i];
                if (this.isString(element) && element == channelName) {
                    found = true;
                    break; 
                }

                if (this.isObject(element) && element.name && element.name == channelName && element.category && element.category == categoryName) {
                    found = true;
                    break;
                }
            }

            return found;
        }

        return this.isString(config) && config == channelName && this.__categoriesMatch(categoryName);
    }


    /**
     * Compare the currently configured category against the 
     * 
     * @private
     * @param {*} categoryReceived 
     * @param {*} categoryConfigured 
     * @return {boolean} 
     */
    __categoriesMatch(categoryName) {

        let category = this.category;
        if (this.isArray(category)) {

            let found = false;
            for (let i = 0; i < category.length; i++) {

                if (category[i] == categoryName) {
                    found = true;
                    break;
                }
            }

            return found;
        }

        return this.isString(category) && category == categoryName;
    }


    /**
     * Retrieved the response from the _default_ section inside the definition file and 
     * replace template sequences of form {<number>} by given additional parameters.
     * 
     * @example
     * getDefaults("wrongChannel", userId, channelName);
     * 
     * @example
     * getDefaults("directMessage", userId);
     * 
     * @param {string} name Retrieve key to be used for the definition file. 
     * @return {string} Reponse with template sequences replaced.
     */
    getDefaults(name) {

        let response = this.defaults[name];
        let prevArguments = Object.keys(arguments).sort().slice(1).map(index => arguments[index]);
        return Formatter.format(response, ...prevArguments);
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
    isDirect() {
         
        let type = {
            direct: false,
            response: ""
        };

        if (!this.message.member) {
            let userId = this.message.author.id;
            type.response = this.getDefaults("directMessage", userId);
            type.direct = true;

        }

        return type; 
    }


    /**
     * Get information about the channel the user is communicating over.
     * 
     * Return Example:
     *  {
     *      isBotChannel: true, // the channel/category to be used for communication
     *      response: "Response to the user in case channel/category or combination does not exist"
     * }
     * 
     * @param {Object} message The received discord.js message object
     * @param {boolean} admin Indicator to check for admin or member channel
     * @return {Object} Object describing the check result
     */
    getChannelInfo(admin = false) {

        // Object to return
        let channelResult = {
            isBotChannel: false,
            response: ''
        };


        // Block direct message
        let messageType = this.isDirect();
        if (messageType.direct) {
            channelResult.response = messageType.response;
            return channelResult;
        }


        // Check if message category matches with configured category
        let category = this.message.channel.parent;
        let guildId = this.message.guild.id;
        let configuredChannelName = this.storage.get("config." + guildId + ".channels." + (admin ? "admin" : "member"));
        let defaultChannelName = admin ? channels.admin : channels.member;

        let channelInfo = this.__aggregateInfo({
            channel: configuredChannelName || defaultChannelName,
            category: category.name
        });

        console.log(channelInfo);



        let isBotCategory = channels.category == category.name;
        if (!channels.category && channels.category != category.name) {
            let categoryExists = this.__categoryExists(this.message, category.name);
            channelResult.response = categoryExists ? 
                this.getDefaults("messageNotOnCategory", this.message.member.id, channels.member, channels.category) : 
                this.getDefaults("categoryNonExistent", this.message.member.id, category.name);
            
            return channelResult;
        }
        channelResult.category = category.name;
        


        // Check the server channel configured via storage.set
        let channelInCat = this.__channelInCategory(configuredChannelName, category.name);
        if (channelInCat) {
            channelResult.isBotChannel = true;
            channelResult.name = configuredChannelName;
            return channelResult;

        }

        // Check the default channel configured in config.js
        channelInCat = this.__channelInCategory(defaultChannelName, category.name); 
        if (channelInCat) {
            channelResult.isBotChannel = true;
            channelResult.name = defaultChannelName;
            return channelResult;

        }

        // Neither default nor configured channel do exist
        channelResult.response = this.getDefaults("channelConfig", this.message.member.id);
        return channelResult;
    }


    __aggregateInfo(params) {

        let information = {
            categoryConfigured: !params.category,
            channelConfigured: !params.channel,
            categoryExists: false,
            channelExists: false,
            channelUnderCategory: false
        };

        let callback = channel => {
            let channelNameEquals = channel.name.toLowerCase() == params.channel.toLowerCase();
            let parentEquals = channel.parent && channel.parent.name.toLowerCase() == params.category.toLowerCase();

            // Set category exists single time if category found
            if (!categoryExists && categoryConfigured && parentEquals) {
                information[categoryExists] = true;
            }

            // Set channel exists single time if channel found
            if (!channelExists && channelConfigured && channelNameEquals) {
                information[channelExists] = "";
            }

            return channelNameEquals && parentEquals;
        };

        // Search for configured channel/category combination
        let result = this.message.guild.channels.cache.each(callback);
        
        return information;
    }


    /**
     * Check if given category is configured on the server
     * 
     * @private
     * @param {string} channelName Name of the channel to look for
     * @param {string} categoryName Name of the category to look for
     * @return {boolean} true | false
     */
    __channelInCategory(channelName, categoryName) {

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
        let result = this.message.guild.channels.cache.find(callback);
        if (!result) {
            return false;
        }

        return true;
    }


    /**
     * 
     * @private
     * @param {*} channelName 
     * @param {*} categoryName 
     */
    __channelExists(channelName, categoryName) {

        let information = {
            channelExists: false,
            categoryExists: false,
            channelOnCategory: false
        }

        let callback = function(channel) {

            if (channelName == channel.name) {
                
            }

        }

        this.message.guild.channels.cache.each(callback);
        return information;        
    }


    /**
     * Check if any channel exists under given category name
     * 
     * @private
     * @param {*} categoryName The name of the category
     * @return {boolean} true | false
     */
    __categoryExists(categoryName) {

        // Prevent check if category name empty
        if (!categoryName) {
            return false;
        }

        let callback = channel => {
            return channel.parent && channel.parent.name.toLowerCase() == categoryName.toLowerCase()
        };

        let result = this.message.guild.channels.cache.find(callback);
        if (!result) {
            return false;
        }

        return true;
    }



    // ------------------------------
    // Utility functions
    // ------------------------------

    isArray(item) {

        return item instanceof Array || typeof item == "array";
    }
    

    isString(item) {
        
        return item instanceof String || typeof item == "string";
    }


    isObject(item) {
        return item instanceof Object || typeof item == "object";
    }



    // ------------------------------
    // Getter/-Setter
    // ------------------------------

    /**
     * Setup server specific channel configuration for bot communication.
     * 
     */
    setChannelConfigs() {

        // Potentially direct messsage, message not from guild
        if (!this.message.guild) {
            return null;
        }

        let guildId = this.message.guild.id;

        // Set category configuration
        let category = this.storage.get("config." + guildId + ".channels.category");
        if (category) {
            this.category = category;

        } else {
            this.setDefaultCategory();

        }

        // Set member configuration
        let member = this.storage.get("config." + guildId + ".channels.member");
        if (member) {
            this.member = member;

        } else {
            this.setDefaultMember();

        }

        // Set admin configuration
        let admin = this.storage.get("config." + guildId + ".channels.admin");
        if (admin) {
            this.admin = amdin;

        } else {
            this.setDefaultAdmin();

        }
    }


    /**
     * Set default channel configuration for member channels.
     */
    setDefaultMember() {
        this.member = channels && channels.member ? channels.member : "";
    }


    /**
     * Set default channel configurations for admin channels.
     */
    setDefaultAdmin() {
        this.admin = channels && channels.admin ? channels.admin : "";
    }


    /**
     * Set default channel configuration for the category of channels.
     */
    setDefaultCategory() {
        this.admin = channels && channels.category ? channels.category : "";
    }
}



module.exports = Communication;