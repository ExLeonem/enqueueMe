const Command = require('../core/command');
const Communication = require('../core/communication');


/**
 * Register a user to waiting for the next enqueued member.
 * 
 * @author Maksim Sandybekov
 * @date 21.05.2020
 * @version 1.0
 * 
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

        let guildId = com.getGuildId();
        let isWaiting = this.storage.get("admin." + guildId + "." + userId + ".waiting");

        // User is already waiting
        if (isWaiting) {

            // Stop listening
            if (args.includes("stop")) {

                this.__removeUserFromList(guildId, userId);
                return message.channel.send(this.getResponse("stopListen", userId));
            }

            return message.channel.send(this.getResponse("alreadyListen", userId));
        }

        this.__addUserToList(guildId, userId);
        return message.channel.send(this.getResponse("startListen", userId));
    }



    /**
     * Set waiting status of the user to false and remove him from the waiting list of the server.
     * 
     * @private
     * @param {number} guildId The unique identifier of the guild 
     * @param {number} userId The unique identifer of the user
     */
    __removeUserFromList(guildId, userId) {

        // Set user state to not waiting
        let key = "admin." + guildId + "." + userId + ".waiting";
        this.storage.set(key, false);

        // Update the waiting list
        let listKey = "admin." + guildId +".waiting";
        let waitingList = this.storage.get(listKey) || [];
        let newWaitingList = waitingList.filter(user => user != userId);

        // Update if list lenghts differ
        if (waitingList.length != newWaitingList.length) {
            this.storage.set(listKey, newWaitingList);

        }
    }


    /**
     * Add a user to the waiting list.
     * 
     * @private
     * @param {number} guildId The unique identifier of the guild 
     * @param {number} userId The unique identifer of the user
     */
    __addUserToList(guildId, userId) {

        // Set user state to waiting
        let key = "admin." + guildId + "." + userId + ".waiting";
        this.storage.set(key, true);
        
        // update the waiting list
        let listKey = "admin." + guildId + ".waiting";
        let currentlyWaiting = this.storage.get(listKey) || [];
        currentlyWaiting.push(userId);
        this.storage.set(listKey, currentlyWaiting);

    }
}


module.exports = Listen;