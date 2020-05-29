const Command = require('../core/command');


/**
 * Peeks into the queue to check the next-x members in line.
 * 
 * @author Maksim Sandybekov
 * @date 25.05.2020
 * 
 * @class
 * @extends Command
 */
class Peek extends Command {

    /**
     * @constructor 
     * @param {string} fileName 
     */
    constructor(fileName) {
        super(fileName);
        
    }

    
    execute(message, args) {


        message.channel.send("Hello world");
    }
}


module.exports = Peek;