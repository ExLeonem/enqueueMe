const Command = require('../core/command');

/**
 * Command to queue a member of a server
 * 
 * @author Maksim Sandybekvo
 * @date 10.05.2020
 */
class Queue extends Command {

    constructor(storage) {
        super("ping", { description: "return me something"});
        this.storage = storage;
    }  

    /**
     * Add user to the queue if not already existent
     * 
     * @param {*} message 
     * @param {*} args 
     */
    execute(message, args) {

        let user = {
            id: message.member.id,
            name: message.member.user.username,
            discriminator: message.member.user.discriminator
        };        

        // Check if user is already in queue
        let currentQueue = this.storage.get("queue");
        let userFound = false;
        for (let i = 0; i < currentQueue.member.length; i++) {
        
            if (currentQueue.member[i].id === user.userId) {
                userFound = true;
                break;
            }
        }

        let responseMessage =  `<@${user.id}> you are already queued!`;
    
        // Add new user to the queue and update the message
        if (!userFound) {

            currentQueue["count"] = currentQueue.member.push({
                ...user,
                time: Date.now()
            });
            this.storage.set("queue", currentQueue);

            responseMessage = `<@${user.id}> I added you to the queue.`;
        }

        return message.channel.send(responseMessage);
    }
    
}


module.exports = Queue;