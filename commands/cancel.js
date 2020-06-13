const Command = require('../core/command');
const Communication = require('../core/communication');


/**
 * Remove a enqueued user from the queue.
 * 
 * @author Maksim Sandybekov
 * @date 11.05.2020
 * @version 1.0
 * 
 * @extends Command
 */
class Cancel extends Command {

    /**
     * @constructor
     * @param {*} fileName The filename in which the command is defined, stripped by the extension.
     */
    constructor(fileName) {
        super(fileName, {description: "Remove a specific user from the queue."});
        
    }   

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
        
        let key = "queue." + message.guild.id;
        let queue = this.storage.get(key) || {"member": [], "count": 0};

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

