const Command = require('../core/command');
const Communication = require('../core/communication');

/**
 * A command to list members of the queue.
 * 
 * @author Maksim Sandybekov
 * @date 11.05.2020
 * @version 1.0
 * 
 * @extends Command
 */
class List extends Command {

    /**
     * @constructor
     * @param {string} fileName 
     */
    constructor(fileName) {
        super (fileName);
        
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

        // List only members enqueued before the caller
        let userId = com.getUserId();
        let guildId = com.getGuildId();
        let queue = this.storage.get('queue.' + guildId) || {"member": [], "count": 0};

        // Empty queue
        if (queue.count <= 0) {
            return message.channel.send(this.getResponse("enqueueFirst", userId));
        }
        
        // Count members queued before caller
        let userCountBefore = 0;
        for (let i = 0; i < queue.member.length; i++) {

            if (queue.member[i].id == userId) {
                break;
            }
            userCountBefore++;
        }

        // Caller is not enqued
        if (userCountBefore == queue.count) {
            return message.channel.send(this.getResponse("notInLine", userId));
        }

        // Caller is next up in the queue
        if (userCountBefore == 0) {
            return message.channel.send(this.getResponse("nextUp", userId));
        }

        return message.channel.send(this.getResponse("membersBefore", userId, userCountBefore));
    }
}


module.exports = List;