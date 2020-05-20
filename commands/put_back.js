const Command = require('../core/command');
const { adminRole } = require('../config.json');


/**
 * Put a dequeued user back into the queue. User is put will be put into .
 * 
 * @author Maksim Sandybekov
 * @date 20.05.2020
 */
class PushBack extends Command {

    constructor(storage) {
        super("putback");

        this.storage = storage;
    }


    execute(message, args) {


        // User to put back.
        let userId = message.member.id;
        let cachedUser = this.storage.get("");

        return message.channel.send(`I've put <@`)
        

    }
}




module.exports = PushBack;