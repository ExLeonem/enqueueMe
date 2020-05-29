const Command = require('../core/command');
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

        let commandNames = [];
        let commandNameMapping = {};
        for (let key of Object.keys(definitions)) {
            let command = definitions[key];

            if (command.name != 'help') {
                commandNames.push(command.name);
            }

            commandNameMapping[command.name] = key;
        }

        // Get help for a specific command
        let userId = message.member? message.member.id : message.author.id;
        let isChannel = message.member? true : false;
        if (args.length == 1 && commandNames.includes(args[0])) {
            let commandFile = commandNameMapping[args[0]];
            let responseMessage = this.getResponse(commandFile, userId, args[0])
            return isChannel? message.channel.send(responseMessage) : message.author.send(responseMessage);
            
        }
        
        // General help info
        commandNames = commandNames.filter(name => name != 'help').join(', ');
        let responseMessage = this.getResponse("general", userId, commandNames);
        return isChannel? message.channel.send(responseMessage) : message.author.send(responseMessage);
    }
}


module.exports = Help;