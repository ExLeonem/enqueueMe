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

        let userId = message.member.id;
        let queue = this.storage.get("queue");
        let newMembers = queue.member.filter(member => member.id != userId);

        // Remove user if found in members
        // let responseMessage = `<@${userId}> you are currently not in the queue. \n You are able to join the queue by typing */qme*.`;
        let responseMessage = this.getResponse("notInQueue", userId);
        if (newMembers.length < queue.member.length) {

            this.storage.set('queue', {member: newMembers, count: --queue.count});
            responseMessage = this.getResponse("removedUser", userId);
        }

        return message.channel.send(responseMessage);
    }
}


module.exports = Cancel;

