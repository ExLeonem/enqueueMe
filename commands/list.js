const Command = require('../core/command');


/**
 * A command to list members of the queue.
 * 
 * @author Maksim Sandybekov
 * @date 11.05.2020
 */
class List extends Command {

    constructor(storage) {
        super('list');
        this.storage = storage;
    }


    execute(message, args) {

        // List all enqueued members
        if (args instanceof Array && args.includes('all')) {
            return this.listAll(message);
        }

        // List only members enqueued before the caller
        let userId = message.member.id;
        let queue = this.storage.get('queue');

        // Empty queue
        if (queue.count <= 0) {
            // You can join the queue with */qme*
            return message.channel.send(`<@${userId}> the queue is empty right now. \n That's you'r chance be the first and join the queue with */qme*.`);
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
            return message.channel.send(`<@${userId}> you are currently not in line. If you want to join the queue you can by typing */qme*`);
        }

        // Caller is next up in the queue
        if (userCountBefore == 0) {
            return message.channel.send(`<@${userId}> you are next up in the queue! ;)`);
        }

        return message.channel.send(`<@${userId}> there's currently ${userCountBefore} members before you.`);
    }


    listAll(message) {

        let userId = message.member.id;
        let queue = this.storage.get('queue');

         // Empty queue
         if (queue.count <= 0) {
            return message.channel.send(`<@${userId}> the queue is empty right now. Should I get back to you if something changes? Type */getback* and I'll contact you if something changes.`);
        }
        
        
        return message.channel.send(responseMessage);
    }

}


module.exports = List;