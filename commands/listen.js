const Command = require('../core/command');
const Communication = require('../core/communication');


/**
 * Register a user to waiting for the next enqueued member.
 * 
 * @author Maksim Sandybekov
 * @date 21.05.2020
 * 
 * @class
 * @extends Command
 */
class Listen extends Command {

    /**
     * @constructor
     * @param {string} fileName 
     */
    constructor(fileName) {
        super(fileName);
        
    }


    execute(message, args) {

        // Stop direct messages, check if channel is configured for communication
        let com = new Communication(message);
        let userId = com.getUserId();
        if (com.isDirect()) {
            return message.channel.send(com.getDefaults("directMessage", userId));
        }

        // Communication on channel is not allowed
        let asAdmin = true;
        if (!com.isAllowed(asAdmin)) {
            return message.channel.send(com.getReason());
        }

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