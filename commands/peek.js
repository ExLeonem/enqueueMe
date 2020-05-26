const Command = require('../core/command');


/**
 * Peeks into the queue to check the next-x members in line.
 * 
 * @author Maksim Sandybekov
 * @date 25.05.2020
 */
class Peek extends Command {

    constructor(storage, fileName) {
        super(fileName);
        this.storage = storage;
    }

    
    execute(message, args) {


        message.channel.send("Hello world");
    }
}


module.exports = Peek;