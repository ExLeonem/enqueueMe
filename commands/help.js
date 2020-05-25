const Command = require('../core/command');


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

        let userId = message.member.id;

        let responseMessage = `<@${userId}> you can use the following commands to chat with me: **qme, cancel, list, dequeue, configure, help**.\n\n`
            + "If you want more information about a specific command just type */help <name of the command>*."

        return message.channel.send(responseMessage);
    }
}


module.exports = Help;