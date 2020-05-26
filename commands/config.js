const Command = require('../core/command');

class Config extends Command {

    constructor(storage, fileName) {
        super(fileName);
        this.storage = storage;
    }


    execute(message, args) {


    }
}


module.exports = Config;