const path = require('path');
const process = require('process');
const fs = require('fs');

const Storage = require('./storage');

/**
 * Handle configuration of the queue bot.
 * Merge, load and set defaults for the configurations in different positions.
 * 
 * @class
 * @author Maksim Sandybekov
 * @date 8.05.20202
 */
class BotConfig {

    static instance = null;

    /**
     * @constructor
     */
    constructor() {

        this.storage = Storage.getInstance();
        this.storageConfig = this.storage.get("config") || {};

        this.configExists = false;
        this.defaultConfig = this.__loadDefaultConfig();
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
     * Merges the default configurations with 
     * 
     * @param {*} guildId 
     */
    __mergeConfig(guildId) {

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


    // -------------------
    // Utilities
    // --------------------------

    isArray(item) {

        return item instanceof Array || typeof item == "array";
    }
    

    isString(item) {
        
        return item instanceof String || typeof item == "string";
    }


    isObject(item) {
        return item instanceof Object || typeof item == "object";
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

        return this.defaultConfig;
    }


    /**
     * Get guild specific configuration.
     * 
     * @param {*} guildId  The id of the guild.
     * @return {Object} The guild configuration.
     */
    getGuildConfig(guildId) {

        return this.storageConfig[guildId] || {};
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