
const Command = require('../core/command');
const Communication = require('../core/communication');


/**
 * Command to queue a member of a server
 * 
 * @author Maksim Sandybekvo
 * @date 10.05.2020
 * @version 1.0
 * 
 * @extends Command
 */
class Enqueue extends Command {

    /**
     * @constructor
     * @param {*} fileName The filename in which the command is defined, stripped by the extension.
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
            return message.channel.send(com.getReason());
        }

        // Add new user to the queue and update the message
        let guildId = com.getGuildId();
        let currentQueue = this._getQueue(guildId);
        let user = this.createUser(message);
        let userFound = this._userEnqueued(user, currentQueue);

        let responseMessage = this.getResponse("alreadyQueued", user.id);
        if (!userFound) {

            currentQueue["count"] = currentQueue["member"].push(user);
            this.storage.set("queue." + guildId , currentQueue);
            responseMessage = this.getResponse("enqueue", user.id);
        }

        // Inform the next waiting admin
        if (this.isListening(guildId)) {
            this.hintAdmin(message, guildId);
        }

        return message.channel.send(responseMessage);
    }


    /**
     * Assembles the data to be saved inside the queue for each member.
     * 
     * @param {Object} message The received discord.js message object.
     * @return {Object}
     */
    createUser(message) {
        return {
            id: message.member.id,
            name: message.member.user.username,
            discriminator: message.member.user.discriminator,
            time: Date.now()
        };
    }


    /**
     * Check if the bot is currently listening for some admin to new enqueues.
     * 
     * @param {number} guildId The unique idenitifer of the guild.
     * @return {boolean} 
     */
    isListening(guildId) {

        let waitingList = this.storage.get("admin." + guildId + ".waiting") || [];
        return waitingList.length > 0;
    }


    /**
     * Inform the next waiting admin about the enqueue.
     * 
     * @param {Object} message The discord.js received message object.
     * @param {number} userId The unique identifer of the user sending the message.
     * @param {number} guildId The unique idenitifer of the guild.
     */
    hintAdmin(message, guildId) {

        let key = "admin." + guildId + ".waiting";
        let waitingList = this.storage.get(key);
        let nextUserId = waitingList.shift();

        if (message.guild.available) {
            let user = message.guild.members.cache.find(member => member.id == nextUserId);
            user.send("A person just joined the queue. You can check the queue with */peek* or remove the next person from the queue with */next*.");
            waitingList.push(nextUserId);

            this.storage.set(key, waitingList);
        }
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