const Command = require('../core/command');
const { channels } = require('../config.json');


/**
 * Command to queue a member of a server
 * 
 * @author Maksim Sandybekvo
 * @date 10.05.2020
 */
class Enqueue extends Command {

    constructor(storage, fileName) {        
        super(fileName, { description: "Queue a member of the server."});
        this.storage = storage;
        
    }  


    /** 
     * Add user to the queue if not already existent
     * 
     * @param {*} message 
     * @param {*} args 
     */
    execute(message, args) {
        

        // Stop direct messages
        if (!message.member || !message.guild) {
            return message.author.send(this.getResponse("noGuild", message.author.id));
        }

        let user = {
            id: message.member.id,
            name: message.member.user.username,
            discriminator: message.member.user.discriminator,
            time: Date.now()
        };

        console.log(message.channel.parent);
        // console.log(message.guild.channels);
        // console.log("--------");

        // Check existens of member channel
        let guildChannel = this.getChannel(message);
        if (!guildChannel.exists) {
            return message.channel.send(guildChannel.response);
        }
    
        // Add new user to the queue and update the message
        let userFound = this._userEnqueued(user);
        let responseMessage = this.getResponse("alreadyQueued", user.id)
        if (!userFound) {

            currentQueue["count"] = currentQueue["member"].push(user);
            this.storage.set("queue", currentQueue);

            responseMessage = this.getResponse("enqueue", user.id);
        }


        console.log("---------");
        console.log(guildChannel.name);
        return message.guild.channels.cache.find(channel => channel.name == guildChannel.name).send(responseMessage);
    }


    /**
     * Check if user is already enqueued.
     * 
     * @param {Object} user 
     * 
     * @return {boolean} true | false depening if the user was found or not
     */
    _userEnqueued(user) {
        
        // Check if user is already in queue
        let currentQueue = this.storage.get("queue");        
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