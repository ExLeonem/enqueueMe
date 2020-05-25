const Command = require('../core/command');

/**
 * A command to list members of the queue.
 * 
 * @author Maksim Sandybekov
 * @date 11.05.2020
 */
class List extends Command {

    constructor(storage, fileName) {
        super (fileName);
        this.storage = storage;
        
    }


    execute(message, args) {

        // List all enqueued members
        if (args instanceof Array && args.includes('all')) {
            return this.listAll(message);
        }

        // List only members enqueued before the caller
        let userId = message.member? message.member.id : message.author.id;
        let queue = this.storage.get('queue');

        // Empty queue
        if (queue.count <= 0) {
            return message.author.send(this.getResponse("queueEmpty", userId));
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
            return message.author.send(this.getResponse("notInLine", userId));
        }

        // Caller is next up in the queue
        if (userCountBefore == 0) {
            return message.author.send(this.getResponse("nextUp", userId));
        }

        return message.author.send(this.getResponse("membersBefore", userId, userCountBefore));
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