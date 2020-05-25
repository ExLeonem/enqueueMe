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

        let responseMessage = this.getResponse("general", userId);
        return message.channel.send(responseMessage);
    }
}


module.exports = Help;