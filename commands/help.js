const Command = require('../core/command');
const StringUtils = require('../core/stringUtils');
const definitions = require('./definitions.json');

/**
 * A command to help a user get more information about the  bot usage
 * 
 * @author Maksim Sandybekov
 * @date 11.05.2020
 */
class Help extends Command {

    constructor(storage, fileName) {
        super(fileName);
        this.storage = storage;
        
    }


    execute(message, args) {

        let commandNames = [];
        let commandHelp = {};
        let commands = Object.keys(definitions).map(key => {

            let command = definitions[key];
            commandNames.push(command.name);
            commandHelp[command.name] = command.responses.help || "";

            return key
        });

        // Get help for a specific command
        let userId = message.member? message.member.id : message.author.id;
        if (args.length == 1) {
            let helpText = commandHelp[args[0]] || "";
            let responseMessage = StringUtils.fillTemplate(helpText, userId);
            return message.author.send(responseMessage);
            
        }
        
        // General help info
        commandNames = commandNames.filter(name => name != 'help').join(', ');
        let responseMessage = this.getResponse("general", userId, commandNames);
        return message.author.send(responseMessage);
    }
}


module.exports = Help;