const Command = require('../core/command');

/**
 * Command to queue a member of a server
 * 
 * @author Maksim Sandybekvo
 * @date 10.05.2020
 */
class Queue extends Command {

    constructor(storage) {
        super("qme", { description: "Queue a member of the server."});
        this.storage = storage;
    }  

    
    /**
     * Add user to the queue if not already existent
     * 
     * @param {*} message 
     * @param {*} args 
     */
    execute(message, args) {
        
        // let isAdded = this.storage.set("queue.var", "Hello world");
        // console.log(isAdded);

        let user = {
            id: message.member.id,
            name: message.member.user.username,
            discriminator: message.member.user.discriminator,
            time: Date.now()
        };        

        // Check if user is already in queue
        let currentQueue = this.storage.get("queue");        
        let userFound = false;
        for (let i = 0; i < currentQueue.member.length; i++) {
        
            if (currentQueue.member[i].id === user.id) {
                userFound = true;
                break;
            }
        }

        let responseMessage =  `<@${user.id}> you are already in the queue. \nIf you want to leave the queue you can cancel anytime with */cancel*.`;
    
        // Add new user to the queue and update the message
        if (!userFound) {

            currentQueue["count"] = currentQueue["member"].push(user);
            this.storage.set("queue", currentQueue);

            responseMessage = `<@${user.id}> I added you to the queue. You can leave whenever you like by typing */cancel*`;
        }

        return message.channel.send(responseMessage);
    }
    
}


module.exports = Queue;