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
 * @property {Object} storage The active storage
 * @property {Object} defaults Responses for default cases invalid channel, ...
 * @property {*} category Configuration of categories to be used for communication.
 * @property {*} member Configuration of channels to be used by members
 * @property {*} admin Configuration of channels to be used by admins
 */
class Communication {


    constructor(message) {
        this.message = message;
        this.storage = Storage.getInstance();
        this.defaults = definitions._defaults_ || {};
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
    isAllowed(admin = false) {

        let channelName = this.getChannel();
        let categoryName = this.getCategory();

        let config = admin ? this.admin : this.member;

        // No configuration for amdin/member given  check if category is configured
        if (!config) {
            return this.__categoriesMatch(categoryName);

        }
        
        // Check if channels and categories match
        return this.__channelsMatch(channelName, categoryName, admin) && this.__categoriesMatch(categoryName);;
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

        categoryName = categoryName.toLowerCase();

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

        // If no category is configured communication on any category is allowed
        return (this.isString(category) && category.toLowerCase() == categoryName) || !category;
    }


    /**
     * Compare the provided channel name with the configured channel names. Return the result of the comparison.
     * 
     * @private 
     * @param {*} channelName 
     * @param {*} admin Whether to check for configured admin channels or member channels
     * @return {boolean} Whether the provided channelName matches with a configured channel
     */
    __channelsMatch(channelName, categoryName = "", admin = false) {

        channelName = channelName.toLowerCase();
        categoryName = categoryName.toLowerCase();

        // Configured multiple channels, check all
        let config = admin ? this.admin : this.member;
        if (this.isArray(config)) {

            let found = false;
            for (let i = 0; i < config.length; i++) {

                // Array entries are strings
                let element = config[i];
                if (this.isString(element) && element.toLowerCase() == channelName) {
                    found = true;
                    break; 
                }

                // channel configuration includes category name (check needed)
                let nameExists = element.name && this.isString(element.name);
                let categoryExists = element.category && this.isString(element.category);
                if (this.isObject(element) && nameExists && element.name.toLowerCase() == channelName && categoryExists && element.category.toLowerCase() == categoryName) {
                    found = true;
                    break;
                }
            }

            return found;
        }

        return this.isString(config) && config.toLowerCase() == channelName;
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
     * @example
     * isDirect();
     * 
     * @param {*} message  A discord.js message object
     * @return {boolean} Whether or not the message received was a direct message.
     */
    isDirect() {
        return !this.message.member; 

    }


    /**
     * Get a response message giving a reason why communication over channel used by the user is not possible.
     * 
     * @param {Object} message The received discord.js message object
     * @param {boolean} admin Indicator to check for admin or member channel
     * @return {string} response message why communication is not possible, if possible "" is returned
     */
    getReason(admin = false) {


        // Message was direct message
        let userId = this.getUserId();
        if (this.isDirect()) {
            return this.getDefaults("directMessage", userId);
        }

        // Category for communication does not exist
        let comInfo = this.__aggregateInfo();
        if (!comInfo.categoryExists && comInfo.channelExists && !comInfo.categoryExists) {
            return this.getDefaults("categoryNonExistent", userId);

        }

        // Check the configuration, channel not setup under right category
        if (!comInfo.channelUnderCategory  && comInfo.categoryExists && !comInfo.channelExists) {
            return this.getDefaults("channelNonExistent", userId);

        }

        // Contacted from right category but wrong channel
        let onCategory = this.__categoriesMatch(this.getCategory());
        let onChannel = this.__channelsMatch(this.getChannel());
        if (onCategory && !onChannel) {
            return this.getDefaults("wrongChannel", userId);
        }
        

        // Neither default nor configured channel do exist
        return this.getDefaults("channelConfig", this.message.member.id);
    }


    /**
     * Perform check to get information about the lack of configuration of the server.
     * Checking if configured channels/categories are existent.
     * 
     * @private
     * @param {*} admin Whether to use the configuration for an admin channel or not
     * @return {Object}  
     */
    __aggregateInfo(admin = false) {

        let info = {
            categoryConfigured: this.category ? true : false,
            channelConfigured: this.getChannelConfig(admin) ? true : false,
            categoryExists: false,
            channelExists: false,
            channelUnderCategory: false
        };

        let callback = channel => {
            // category exists 

            if (channel.type != "text") {
                return;
            }

            let categoryExists = this.__categoriesMatch(channel.parent.name);
            let channelExists = this.__channelsMatch(channel.name, channel.parent.name);

            // Set category exists single time if category found
            if (!info["categoryExists"] && categoryExists) {
                info["categoryExists"] = true;
            }

            // Set channel exists single time if channel found
            if (!info["channelExists"] && channelExists) {
                info["channelExists"] = true;
            }

            // A channel under one of th econfigured 
            if (!info["channelUnderCategory"] && categoryExists && channelExists) {
                info["channelUnderCategory"] = true;
            }
        };

        // Search for configured channel/category combination
        this.message.guild.channels.cache.each(callback);
        return info;
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
     * Retrieve and return the id of the user.
     * 
     * @return {number} 
     */
    getUserId() {
        return this.message.member? this.message.member.id : this.message.author.id;
    }


    /**
     * Retrieve and return the guild from the message object.
     * 
     * @return {number}
     */
    getGuildId() {
        return this.message.guild? this.message.guild.id : null;
    }


    /**
     * Retrieve and return the channeln name of the current message.
     * 
     * @return {string}
     */
    getChannel() {
        return this.message.channel && this.message.channel.name ? this.message.channel.name : "";
    }

    
    /**
     * Retrieve and return the category name of the current message.
     * 
     * @return {string} 
     */
    getCategory() {
        return this.message.channel && this.message.channel.parent ? this.message.channel.parent.name : "";
    }


    /**
     * 
     * @param {*} admin 
     */
    getChannelConfig(admin = false) {
        return admin ? this.member : this.admin;
    }


    /**
     * 
     */
    getCategoryConfig() {
        return this.category;
    }


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
        this.category = channels && channels.category ? channels.category : "";
    }
}



module.exports = Communication;