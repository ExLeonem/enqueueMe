const Command = require('../core/command');


/**
 * Remove a enqueued user from the queue.
 * 
 * @author Maksim Sandybekov
 * @date 11.05.2020
 */
class Cancel extends Command {

    constructor(storage) {
        super('cancel', {description: "Remove a specific user from the queue."});
        this.storage = storage;
    }   


    execute(message, args) {

        let userId = message.member.id;
        let queue = this.storage.get("queue");
        let newMembers = queue.member.filter(member => member.id != userId);

        // Remove user if found in members
        let responseMessage = `<@${userId}> you are currently not in the queue. \n You are able to join the queue by typing */qme*.`;
        if (newMembers.length < queue.member.length) {

            this.storage.set('queue', {member: newMembers, count: --queue.count});
            responseMessage = `<@${userId}> I removed you from the queue. You can join again by typing */qme*`;
        }

        return message.channel.send(responseMessage);
    }
}


module.exports = Cancel;

