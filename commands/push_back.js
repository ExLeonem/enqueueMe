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
        super("pushBack");

        this.storage = storage;
    }


    execute(message, args) {

        

    }
}




module.exports = PushBack;