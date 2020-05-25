const Command = require('../core/command');
const { adminRole } = require('../config.json');

/**
 * Dequeue the next user, to perform an action.
 *  
 * @author Maksim Sandybekov
 * @date 10.05.2020
 */
class Dequeue extends Command {

    constructor(storage, fileName) {
        super(fileName);
        this.storage = storage;
    }


    execute(message, args) {

        let userId = message.member.id;

        // User doesen't have the permission to request information
        if (!message.member.roles.cache.some(role => role.name == adminRole)) {
            return message.channel.send(`Sorry <@${userId}> but I can't give you that Info. Check with someone who can grant you the **Bot Admin** Role.`);

        }

        let queue = this.storage.get('queue');
        if (queue.count <= 0) {
            return message.channel.send(`Currently there's no one in the queue <@${userId}>. I can get back to you if someone enters, simply type */listen*`);
            
        }

        let nextUser = queue.member.shift();
        let adminKey = "admin." + userId + ".cachedMembers";
        let cachedUsers = this.storage.get(adminKey);

        // Add user to the cached users
        if (cachedUsers instanceof Array) {
            cachedUsers = cachedUsers.filter(member => member.id != nextUser.id);
            cachedUsers.push(nextUser);

        } else {
            cachedUsers = [nextUser];
            
        }

        this.storage.set('queue', {member: queue.member, count: --queue.count});
        this.storage.set(adminKey, cachedUsers);

        message.channel.send(`The next user in the queue is <@${nextUser.id}>. You can put him back into the queue with */putback*.`);
    }   
}


module.exports = Dequeue;