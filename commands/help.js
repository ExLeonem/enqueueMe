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

        // To many parameters
        // if (args.length > 1) {
        //     return 
        // }

        let mapping = this.__aggregateCommands();

        // Get help for a specific command
        let userId = message.member? message.member.id : message.author.id;
        let isChannel = message.member? true : false;
        if (args.length == 1 && mapping.names.includes(args[0])) {
            let commandFile = mapping.map[args[0]];
            let responseMessage = this.getResponse(commandFile, userId, args[0])
            return isChannel? message.channel.send(responseMessage) : message.author.send(responseMessage);
            
        }
        
        // General help info
        let filteredCommandNames = mapping.names.filter(name => name != 'help').join(', ');
        let responseMessage = this.getResponse('general', userId, filteredCommandNames);
        return isChannel? message.channel.send(responseMessage) : message.author.send(responseMessage);
    }


    getCommandHelp() {

    }


    /**
     * Aggregate command names in an array and a map between filename and command name.
     * 
     * @private
     * @return {"map": {Object}, "names": string[]}
     */
    __aggregateCommands() {

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