const Command = require('../core/command');
const Communication = require('../core/communication');


/**
 * Command to queue a member of a server
 * 
 * @author Maksim Sandybekvo
 * @date 10.05.2020
 * 
 * @class
 * @extends Command
 */
class Enqueue extends Command {

    /**
     * @constructor
     * @param {*} fileName 
     */
    constructor(fileName) {
        super(fileName, { description: "Queue a member of the server."});
        
    }  


    /** 
     * Add user to the queue if not already existent
     * 
     * @param {*} message 
     * @param {*} args 
     */
    execute(message, args) {
        
        // Stop direct messages, check if channel is configured for communication
        let com = new Communication(message);
        if (com.isDirect()) {
            return message.channel.send(com.getDefaults("directMessage", com.getUserId()));
        }

        // Communication on channel is not allowed
        if (!com.isAllowed()) {
            return com.getReason();
        }

        let user = {
            id: message.member.id,
            name: message.member.user.username,
            discriminator: message.member.user.discriminator,
            time: Date.now()
        };

        // Add new user to the queue and update the message
        let guildId = message.guild.id;
        let currentQueue = this._getQueue(guildId);
        let userFound = this._userEnqueued(user, currentQueue);
        let responseMessage = this.getResponse("alreadyQueued", user.id)
        if (!userFound) {

            currentQueue["count"] = currentQueue["member"].push(user);
            this.storage.set("queue." + guildId , currentQueue);
            responseMessage = this.getResponse("enqueue", user.id);
        }


        return message.channel.send(responseMessage);
    }


    /**
     * Create a queue for a specific server if it's not already existent.
     * 
     * @private
     * @param {Number} guildId The guild id under which the queue is saved
     * @return {Object} The existing or created queue
     */
    _getQueue(guildId) {

        let key = "queue." + guildId;
        let queue = this.storage.get(key);
        if (queue == undefined || !(Object.keys(queue).length > 0)) {

            queue = {
                member: [],
                count: 0
            }
            this.storage.set(key, queue)
        }

        return queue;
    }


    /**
     * Check if user is already enqueued.
     * 
     * @private
     * @param {Object} user 
     * @return {boolean} true | false depening if the user was found or not
     */
    _userEnqueued(user, currentQueue) {
        
        // Check if user is already in queue     
        let userFound = false;
        for (let i = 0; i < currentQueue.member.length; i++) {

            if (currentQueue.member[i].id === user.id) {
                userFound = true;
                break;

            }
        }

        return userFound;
    }
    
}


module.exports = Enqueue;