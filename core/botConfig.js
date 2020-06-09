const path = require('path');
const process = require('process');
const fs = require('fs');

const Storage = require('./storage');
const Type = require('./type');



/**
 * Handle configuration of the queue bot.
 * Load guild specific configurations
 * 
 * @class
 * @author Maksim Sandybekov
 * @date 8.05.20202
 * 
 * @property {Object} storage The current storage object.
 * @property {Object} defaults The default configuration set before starting the bot located in ../config.json
 * @property {boolean} configExists Indicator whether default configuration exists
 */
class BotConfig {

    static instance = null;

    /**
     * @constructor
     */
    constructor() {

        this.storage = Storage.getInstance();
        this.configExists = false;
        this.defaults = this.__loadDefaultConfig();
    }


    /**
     * Singleton method. Create a single instance of this object.
     * 
     * @return {Object} The bot configuration object.
     */
    static getInstance() {

        if (BotConfig.instance == null) {
            BotConfig.instance = new BotConfig();
        }

        return BotConfig.instance;
    }


    /**
     * Load the channel configuration for a specific guild.
     * 
     * @param {*} guildId Unique identifier of the guild
     * @return {Object}
     */
    loadGuildChannels(guildId) {

        let guildConfig = this.getGuildConfig(guildId);
        return guildConfig["channel"] || {"category": null, "member": null, "admin": null}; 
    }
    

    /**
     * Updates the channel configuration for a specific guild.
     * 
     * @param {*} guildId Unique identifier of the guild
     * @param {Object} channelConfig The new channel configuration
     */
    setGuildChannels(guildId, channelConfig) {

        this.storage.set("config." + guildId + ".channel", channelConfig);
    }



    /**
     * Loads the default configuration into the overall configuration.
     * 
     * @return {Object} The default configuration.
     */
    __loadDefaultConfig()  {

        let configPath = path.join(process.cwd(), "config.json");
        let config = {};
        if (fs.existsSync(configPath)) {

            config = JSON.parse(fs.readFileSync(configPath));
            this.configExists = true;
        }

        return config;
    }



    // ----------------
    // Setter/-Getter
    // ------------------------

    /**
     * Return the default configuration that was loaded into the bot configuration instance.
     * 
     * @return {Object} The default configuration.
     */
    getDefaultConfig() {

        return this.defaults;
    }


    /**
     * Get guild specific configuration.
     * 
     * @param {*} guildId  The id of the guild.
     * @return {Object} The guild configuration.
     */
    getGuildConfig(guildId) {

        return this.storage.get("config." + guildId) || {};
    }


    /**
     * Returns whether a bot configuration file exists and is loaded or not.
     * 
     * @return {boolean} true | false
     */
    exists() {

        return this.configExists;
    }
}


module.exports = BotConfig;