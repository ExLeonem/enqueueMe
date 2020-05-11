const Command = require('../core/command');

/**
 * 
 * 
 * @author Maksim Sandybekov
 * @date 11.05.2020
 */
class Help extends Command {

    constructor(storage) {
        super('help');
        this.storage = storage;
    }


    execute(message, args) {

    }
}


module.exports = Help;