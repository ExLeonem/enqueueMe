const Command = require('../core/command');


class Listen extends Command {

    constructor(storage) {
        super('listen');
        this.storage = storage;

    }


    execute(message, args) {

        let userId = message.member.id;

        return message.channel.send(`I'll keep my eyes open. If a member enqueues I'm going to tell you <@${userId}>.`)
    }
}


module.exports = Listen;