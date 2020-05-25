const Command = require('../core/command');


/**
 * Register a user to waiting for the next enqueued member.
 * 
 * @author Maksim Sandybekov
 * @date 21.05.2020
 */
class Listen extends Command {

    constructor(storage, fileName) {
        super(fileName);
        this.storage = storage;
        
    }


    execute(message, args) {

        let userId = message.member? message.member.id : message.author.id;
        let key = "admin." + userId + ".waiting";
        let isWaiting = this.storage.get(key);

        // User is already waiting
        if (isWaiting) {

            // Stop listening
            if (args.includes("stop")) {

                this.storage.set(key, false);
                return message.author.send(this.getResponse("stopListen", userId));
            }

            return message.author.send(this.getResponse("alreadyListen", userId));
        }

        this.storage.set(key, true);
        return message.author.send(this.getResponse("startListen", userId));
    }
}


module.exports = Listen;