const Command = require('../core/command');
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
        let commands = Object.keys(definitions).map(key => {

            let command = definitions[key];
            let result = {};

            commandNames.push(command.name);
            result[command.name] = command.responses.help || "";

            return result;
        });

        let userId = message.member.id;

        // Get help for a specific command
        if (args.length > 0) {

            
            // let commandHelp = this.;
            // return message.channel.send();
        }
        
        // General help info
        commandNames = commandNames.filter(name => name != 'help').join(', ');
        let responseMessage = this.getResponse("general", userId, commandNames);
        return message.channel.send(responseMessage);
    }
}


module.exports = Help;