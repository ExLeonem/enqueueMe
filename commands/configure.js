const Command = require('../core/command');

/**
 * Configure the queue.
 * 
 * @author Maksim Sandybekov
 * @date 11.05.2020
 */
class Configure extends Command {

    constructor(storage) {
        super('configure', {description: ""});
        this.storage = storage;

    }


    execute(message, args) {

        
    }
}

module.exports = Configure;