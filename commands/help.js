const Command = require('../core/command');
const Communication = require('../core/communication');
const definitions = require('./definitions.json');


/**
 * A command to help a user get more information about the  bot usage
 * 
 * @author Maksim Sandybekov
 * @date 11.05.2020
 * 
 * @class
 * @extends Command
 */
class Help extends Command {

    /**
     * @constructor
     * @param {string} fileName 
     */
    constructor(fileName) {
        super(fileName);
        
    }


    execute(message, args) {

         // Communication on channel is not allowed
         let com = new Communication(message);
         if (!com.isAllowed()) {
            return message.channel.send(com.getReason());
        }

        let userId = com.getUserId();
        let responseMessage = "";

        if (args.length > 0) {
            responseMessage =  this.getCommandHelp(args,  userId);
            return com.isDirect() ? message.author.send(responseMessage) : message.channel.send(responseMessage);
        }
        
        // Return the general 
        responseMessage = this.getHelpOverview(userId);
        return com.isDirect() ? message.author.send(responseMessage) : message.channel.send(responseMessage);
    }


    /**
     * Get the help response for a specific argument. 
     * 
     * @param {*} args The arguments passed with the message.
     * @param {*} userId The id of the calling user.
     * @return {string} The response text.
     */
    getCommandHelp(args, userId) {

        let mapping = this.__aggregateCommandMap();
        let responseMessage = this.getResponse("noSuchCommand", userId);

        // To many arguments
        if (args.length > 1) {
            responseMessage = this.getResponse("tooMany", userId);
        }

        // Get help for a specific command
        if (args.length == 1 && mapping.names.includes(args[0])) {
            let commandFile = mapping.map[args[0]];

            try {
                responseMessage = this.getResponse(commandFile, userId, args[0])            

            } catch (err) {
                responseMessage = this.getResponse("noHelp", userId);

            }
        }

        return responseMessage;
    }


    /**
     * Get the general help.
     * 
     * @param userId The id of the calling user.
     * @return {string} The repsonse text.
     */
    getHelpOverview(userId) {

        let mapping = this.__aggregateCommandMap();

        // General help info
        let filteredCommandNames = mapping.names.filter(name => name != 'help').join(', ');
        return this.getResponse('general', userId, filteredCommandNames);
    }


    /**
     * Aggregate command names in an array and a map between filename and command name.
     * 
     * @private
     * @return {"map": {Object}, "names": string[]}
     */
    __aggregateCommandMap() {

        let commandNames = [];
        let commandNameMapping = {};
        for (let key of Object.keys(definitions)) {
            let command = definitions[key];

            if (command.name !== 'help' && command.name !== '_defaults_') {
                commandNames.push(command.name);
                commandNameMapping[command.name] = key;
            }
        }

        return {"map": commandNameMapping, "names": commandNames};
    }

}



module.exports = Help;