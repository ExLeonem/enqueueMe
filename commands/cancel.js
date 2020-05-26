const Command = require('../core/command');


/**
 * Remove a enqueued user from the queue.
 * 
 * @author Maksim Sandybekov
 * @date 11.05.2020
 */
class Cancel extends Command {

    constructor(storage, fileName) {
        super(fileName, {description: "Remove a specific user from the queue."});
        this.storage = storage;
        
    }   


    execute(message, args) {

        // Stop direct messages, check if channel is configured for communication
        let channelInfo = this.getChannelInfo(message);
        if (!channelInfo.isBotChannel) {
            return message.channel.send(channelInfo.response);
        }
  
        let key = "queue." + message.guild.id;
        let queue = this.storage.get(key);

        let userId = message.member? message.member.id : message.author.id;
        let newMembers = queue.member.filter(member => member.id != userId);

        // Remove found user and update the queue
        let responseMessage = this.getResponse("notInQueue", userId);
        if (newMembers.length < queue.member.length) {
            
            this.storage.set(key, {member: newMembers, count: --queue.count});
            responseMessage = this.getResponse("removedUser", userId);
        }

        return message.channel.send(responseMessage);
    }
}


module.exports = Cancel;

