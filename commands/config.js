const Command = require('../core/command');
const Communication = require('../core/communication');



/**
 * Set guild specific configurations for the queue.
 * 
 * @class
 * @author Maksim Sandybekov
 * @date 06.05.2020
 */
class Config extends Command {

    constructor(fileName) {
        super(fileName);
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
     * @param {*} args Arguments received from the user.
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
                response = this.printChannelConfig(args);
                break;
            }
            case "add": {
                response = this.addChannel(args);
                break; 
            }
            case "rm": {
                response = this.removeChannel(args);
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

        


    }


    /**
     * Add a channel to the configuration over which communication is possible
     * 
     * @param {string[]} args Arugments passed by the user
     * @param {Object} com Communication object including relevant information depending the current message.
     * @return {string} A response message for the user.
     */
    addChannel(args, com) {


    }


    /**
     * Remove a channel from the guild configuration.
     * 
     * @param {string[]} args Arugments passed by the user
     * @param {Object} com Communication object including relevant information depending the current message.
     * @return {string} A response message for the user.
     */
    removeChannel(args, com) {


    }


    /**
     * Perform queue configurations.
     * 
     * @param {*} args Arguments received from the user.
     * @param {Object} com Communication object including relevant information depending the current message.
     * @return {string} Return response message
     */
    queueConfig(args, com) {
        

    }


    /**
     * Configure the admin role which allows for configuration of the bot.
     * Relevant if the bot is configured to allow communication over all channels.
     * 
     * @param {*} args Arguments received from the user.
     * @param {Object} com Communication object including relevant information depending the current message.
     * @return {string} Return response message
     */
    adminConfig(args, com) {

    }

}


module.exports = Config;