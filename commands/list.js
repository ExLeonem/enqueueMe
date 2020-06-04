const Command = require('../core/command');
const Communication = require('../core/communication');

/**
 * A command to list members of the queue.
 * 
 * @author Maksim Sandybekov
 * @date 11.05.2020
 * 
 * @class
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

        // List all enqueued members
        if (args instanceof Array && args.includes('all')) {
            return this.listAll(message);
        }

        // List only members enqueued before the caller
        let userId = message.member? message.member.id : message.author.id;
        let queue = this.storage.get('queue' + message.guild.id) || {"member": [], "count": 0};

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


    listAll(message) {

        let userId = message.member? message.member.id : message.author.id;
        let queue = this.storage.get('queue');

         // Empty queue
         if (queue.count <= 0) {
            return message.author.send(this.getResponse("enqueueFirst", userId));
        }
        
        
        return message.author.send(responseMessage);
    }

}


module.exports = List;