const Command = require('../core/command');
const Communication = require('../core/communication');
const { adminRole} = require('../config.json');

/**
 * Dequeue the next user, to perform an action.
 *  
 * @author Maksim Sandybekov
 * @date 10.05.2020
 * 
 * @class
 * @extends Command
 */
class Dequeue extends Command {

    /**
     * @constructor
     * @param {*} fileName 
     */
    constructor(fileName) {
        super(fileName);

    }


    execute(message, args) {

         // Stop direct messages, check if channel is configured for communication
         let com = new Communication(message);
         if (com.isDirect()) {
             return message.channel.send(com.getDefaults("directMessage", com.getUserId()));
         }
 
         // Communication on channel is not allowed
         let asAdmin = true;
         if (!com.isAllowed(asAdmin)) {
             return message.channel.send(com.getReason());
         }

        // Can't get the next person, queue is empty
        let key = "queue." + message.guild.id;
        let queue = this.storage.get(key);
        if (queue.count <= 0) {
            return message.author.send(his.getResponse("queueEmpty", userId));
            
        }

        let nextUser = queue.member.shift();
        let adminKey = "admin." + message.guild.id + "." + userId + ".cachedMembers";
        let cachedUsers = this.storage.get(adminKey);

        // Add user to the cached users
        if (cachedUsers instanceof Array) {
            cachedUsers = cachedUsers.filter(member => member.id != nextUser.id);
            cachedUsers.push(nextUser);

        } else {
            cachedUsers = [nextUser];
            
        }

        // Update storage queue and user cache
        this.storage.set(key, {member: queue.member, count: --queue.count});
        this.storage.set(adminKey, cachedUsers);

        message.author.send(this.getResponse("nextUp", userId));
    }   
}


module.exports = Dequeue;