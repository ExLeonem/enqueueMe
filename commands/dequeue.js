const Command = require('../core/command');

/**
 * 
 * @author Maksim Sandybekov
 * @date 10.05.2020
 */
class Dequeue extends Command {

    constructor(storage) {
        super("next");
        this.storage;
    }


    execute(message, args) {

        

        message.channel.send("Dequeue next member.");
    }   
}


module.exports = Dequeue;