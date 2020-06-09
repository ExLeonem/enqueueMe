const Command = require('../core/command');
const Communication = require('../core/communication');
const BotConfig = require('../core/botConfig');
const Type = require('../core/type');

/**
 * Set guild specific configurations for the queue.
 * 
 * @author Maksim Sandybekov
 * @date 06.05.2020
 * @version 0.8
 */
class Config extends Command {

    constructor(fileName) {
        super(fileName);
        this.botConfig = BotConfig.getInstance();
    }


    execute(message, args) {

        // Stop direct messages, check if channel is configured for communication
        let com = new Communication(message);
        if (com.isDirect()) {
            return message.channel.send(com.getDefaults("directMessage", com.getUserId()));
        }

        // Communication on channel is not allowed
        let asAdmin = true;
        if (!com.isAllowed(asAdmin)) {
            return message.channel.send(com.getReason());
        }
        
        let response = this.dispatchOptions(args, com);
        return message.channel.send(response);
    }


    /**
     * Dispatch on main configuration option to perform the specific configuration.
     * 
     * @param {string[]} args Parameters received from the user.
     * @param {Object} com Communication object including relevant information depending the current message.
     * @return {string} Return response message
     */
    dispatchOptions(args, com) {

        if (args.length < 1) {
            return message.reply(this.getResponse("wrongArgs"));
        }

        // Dispatch on main command
        let argKey = args.shift();
        let response = "";
        switch(argKey) {
            case "channel": {
                response = this.channelConfig(args);
                break;
            }
            case "queue": {
                response = this.queueConfig(args);
                break;
            }
            case "admin": {
                response = this.adminConfig(args);
                break;
            }
        }

        return response;
    }


    /**
     * Perform channel configurations.
     * 
     * @param {string[]} args Arguments received from the user.
     * @param {Object} com Communication object including relevant information depending the current message.
     * @return {string} Return response message
     */
    channelConfig(args, com) {

        if (!(args.length >= 1)) {
            return 
        }

        // Dispatch configuration options
        let option = args.shift();
        let response = "";
        switch(option) {
            case "show": {
                response = this.printChannelConfig(args, com);
                break;
            }
            case "add": {
                response = this.addChannel(args, com);
                break; 
            }
            case "rm": {
                response = this.removeChannel(args, com);
                break;
            }
        }

        return response;
    }


    /**
     * Create a response message to give information about the current configuration of channels.
     * 
     * @param {string[]} args Arugments passed by the user
     * @param {Object} com Communication object including relevant information depending the current message.
     * @return {string} A response message for the user.
     */
    printChannelConfig(args, com) {

        let userId = com.getUserId();
        let config = this.storage.get("config." + com.getGuildId());

        // No indication whether to use member oder admin channel
        if (args.length != 1) {
            return this.getResponse("missingChannelType", userId);
        }

        // Invalid channel type
        let channelType = args[0];
        if (!["member", "admin"].includes(channelType)) {
            return this.getResponse("wrongChannelType", channelType, "member, admin");
        }

        // Theres no configuration
        if (!config || !config.channel || !config.channel[channelType]) {
            return this.getResponse("noChannelConfig", userId);
        }

        let channelConfig = config.channel[channelType];
        let category = channelCofnig.category ? channelConfig.category : "";

        let memberChannelInfo = "";
        if (Type.isArray(channelConfig)) {

            for (let i = 0; i < channelConfig.member.length; i++) {

                let configuredChannel = channelCOnfig.member[i];
                if (configuredChannel) {
                    
                }
            }

        } else if (Type.isString(channelConfig)) {
                
            
        }

        return memberChannelInfo;
    }


    /**
     * Perfom checks on args before passing values to add to the current channel configuration.
     * 
     * @param {string[]} args Arugments passed by the user
     * @param {Object} com Communication object including relevant information depending the current message.
     * @return {string} A response message for the user.
     */
    addChannel(args, com) {

         // Enough args supplied?
         if (args.length != 3) {
            return this.getReponse("wrongArgs");
        }

        // Valid channel type?
        let channelType = args[0].toLowerCase();
        if (!this.validChannelType(channelType)) {
            return this.getResponse("wrongChannelType", channelType, "member, admin");
        }

        let config = this.botConfig.loadGuildChannels(com.getGuildId());
        let toAdd = {"name": args[1].toLowerCase(), "category": args[2].toLowerCase()};
        let channelConfig = this.__addChannelConfig(toAdd, config[channelType], com);

        // Configuration could not be added?
        if (!channelConfig.wasAdded) {
            return channelConfig.response;
        }
        
        config[channelType] = channelConfig.new;
        this.botConfig.setGuildChannels(com.getGuildId(), config);
        return channelConfig.response;
    }


    /**
     * Add a new configuration to the existing. 
     * Check for duplicates and return according response message.
     * 
     * @private
     * @param {Object} toAdd The channel configuration to add {name: string, category: string}
     * @param {Object} channelConfig The configuration for the channel [{name: string, category: string}, ...] | null
     * @param {Object} com A communication object, encapsulates information about the received message.
     * @return {Object} {wasAdded: boolean, response: string, new: Object}
     */
    __addChannelConfig(toAdd, channelConfig, com) {

        // Channel configuration is not array
        let responseObj = {wasAdded: true, response: this.getResponse("channelAddSuccess", channelConfig.name), new: [toAdd]};
        if (!Type.isArray(channelConfig)) {
            return responseObj;
        }

        // Any duplicate configurations?
        for (let i = 0; i < currentChannelConfig.length; i++) {

            if (currentChannelConfig[i].name === toAdd.name && currentChannelConfig[i].category === toAdd.category) {

                responseObj.wasAdded = false;
                responseObj.response = this.getResponse("channelAddDuplicate", com.getUserId());
                responseObj.new = null;
                return responseObj;
            }
        }
        
        // Successfully appended
        channelConfig.push(toAdd);
        responseObj.new = channelConfig;
        return responseObj;
    }


    /**
     * Remove a channel from the guild configuration.
     * 
     * @param {string[]} args Arugments passed by the user
     * @param {Object} com Communication object including relevant information depending the current message.
     * @return {string} A response message for the user.
     */
    removeChannel(args, com) {

        // Enough args supplied?
        if (args.length != 3) {
            return this.getResponse("wrongArgs");
        }

        // Valid channel type passed?
        let channelType = args[0].toLowerCase();
        if (!this.validChannelType(channelType)) {
            return this.getResponse("wrongChannelType", channelType, "member, admin");
        }

        let config = this.botConfig.loadGuildChannels(com.getGuildId());
        let toRemove = {"name": args[1].toLowerCase(), "category": args[2].toLowerCase()};
        let channelConfig = this.__removeChannelConfig(toRemove, config[channelType], com);

        // Configuration could not be removed?
        if (!channelConfig.wasRemoved) {
            return channelConfig.response;
        }

        config[channelType] = channelConfig.new;
        this.botConfig.setGuildChannels(com.getGuildId(), config);
        return channelConfig.response;
    }


    /**
     * Perform the remove of the given channel configuration.
     * Iterate through the existing configurations.
     * Give apropriate response if not existent.
     * 
     * @private
     * @param {Object} toRemove The configuration to remove {name: string, category: string}
     * @param {Object} channelConfig The configuration for the channel [{name: string, category: string}, ...] | null
     * @param {Object} com A communication object, encapsulates information about the received message.
     * @return {Object} {wasRemoved: boolean, response: string, new: *}
     */
    __removeChannelConfig(toRemove, channelConfig, com) {

        // Catch empty configuration
        if (!Type.isArray(channelConfig)) {
            return {wasRemoved: false, response: this.getResponse("noChannelConfig", com.getUserId()), new: null};
        }

        // Search and remove when found
        let foundChannel = false;
        let foundCategory = false;
        for (let i = 0; i < channelConfig.length; i++) {

            if (toRemove.name === channelConfig[i].name && toRemove.category === channelConfig[i].category) {
                channelConfig.splice(i, 1);
                return {wasRemoved: true, response: this.getResponse(""), new: channelConfig};
            }
        }

        // Only category names or channel names didn't match?
        return {
            wasRemoved: false, 
            response: this.getResponse("channelRmFailed", com.getUserId(), toRemove.category, toRemove.name), 
            new: null
        };
    }


    /**
     * Perform queue configurations.
     * 
     * @param {string[]} args Arguments received from the user.
     * @param {Object} com Communication object including relevant information depending the current message.
     * @return {string} Return response message
     */
    queueConfig(args, com) {
        
        // Not enough parameters to set max queue size
        if (args.length != 1) {
            return this.getResponse("wrongArgs", com.getUserId());;
        }

        try {

            let newSize = parseInt(args[0]);
            let guildId = com.getGuildId();
            let config = this.botConfig.loadGuildQueue(guildId);

            config.size = newSize;
            this.botConfig.setGuildQueue(guildId, config);
            return this.getReponse("queueSizeSet", newSize)

        } catch (e) {
            return this.getResponse("queueSizeNoNumber", com.getUserId(), args[0]);
        
        }
    }


    /**
     * Configure the admin role which allows for configuration of the bot.
     * Relevant if the bot is configured to allow communication over all channels.
     * 
     * @param {string[]} args Arguments received from the user.
     * @param {Object} com Communication object including relevant information depending the current message.
     * @return {string} Return response message
     */
    adminConfig(args, com) {

        // Not enough arguments?
        if (args.length != 1) {
            return this.getResponse("wrongArgs");
        }

        let guildId = com.getGuildId();
        let config = this.botConfig.getGuildConfig(guildId);
        
        config["adminRole"] = args[0];
        this.botConfig.setGuildConfig(guildId, config);

        return this.getResponse("adminRoleSet", args[0]);
    }



    // ---------------
    // Utilties
    // ---------------------

    /**
     * Check if the given channel type is valid.
     * Valid channel types are: [admin, member].
     * Member: Regular members of the server can communicate with the bot
     * Admin: Only admins are able to communicate with the bot
     * 
     * @param {string} channelType The name of the channel type
     * @return {boolean}
     */
    validChannelType(channelType) {
        
        return ["admin", "member"].includes(channelType.toLowerCase());
    }


    /**
     * Aggregate information
     * 
     * @private
     * @return {string}
     */
    __aggregateInformation() {

    }

}


module.exports = Config;