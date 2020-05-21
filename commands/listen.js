const Command = require('../core/command');


/**
 * Register a user to waiting for the next enqueued member.
 * 
 * @author Maksim Sandybekov
 * @date 21.05.2020
 */
class Listen extends Command {

    constructor(storage) {
        super('listen');
        this.storage = storage;

    }


    execute(message, args) {

        let userId = message.member.id;
        let key = "admin." + userId + ".waiting";
        let isWaiting = this.storage.get(key);

        // User is already waiting
        if (isWaiting) {

            // Stop listening
            if (args.includes("stop")) {

                this.storage.set(key, false);
                return message.channel.send(`Okay <@${userId}>, but keep in mind that the next members who enqueue will be unnotice. You can always give me a signal with */listen* to start informing you.`);
            }

            return message.channel.send(`I already noted, that you want hints about the members which enqueued. Don't worry <@${userId}> I'll keep you up to date!`);
        }

        this.storage.set(key, true);
        return message.channel.send(`I'll let you know if someone enqueues <@${userId}>. If you don't want me to to give you a hint you can type */listen stop*.`);
    }
}


module.exports = Listen;