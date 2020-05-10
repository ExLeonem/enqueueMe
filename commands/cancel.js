const Command = require('../core/command');


class Cancel extends Command {

    constructor(storage) {
        super('cancel');
        this.storage = storage;
    }   


    execute(message, args) {

    }
}


module.exports = Cancel;

