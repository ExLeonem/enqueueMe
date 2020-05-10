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


        let responseMessage = `<@${userId}> currently you are not in the queue. \n You are able to list in the queue with /qme.`;
        if (newMembers.length < queue.member.length) {

            console.log("remove user");
            this.storage.set('queue', {member: newMembers, count: queue.member.count--});
            responseMessage = `<@${userId}> I removed you from the queue.`;
        }

        return message.channel.send(responseMessage);
    }
}


module.exports = Cancel;

