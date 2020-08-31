const Command = require('../core/command');
const Communication = require('../core/communication');


/**
 * Dequeue the next user, to perform an action.
 *  
 * @author Maksim Sandybekov
 * @date 10.05.2020
 * @version 1.0
 * 
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
         let userId = com.getUserId();
         if (com.isDirect()) {
             return message.channel.send(com.getDefaults("directMessage", userId));
         }
 
         // Communication on channel is not allowed
         let asAdmin = true;
         if (!com.isAllowed(asAdmin)) {
             return message.channel.send(com.getReason());
         }

        // Can't get the next person, queue is empty
        let guildId = com.getGuildId();
        let key = "queue." + guildId;
        let queue = this.storage.get(key);
        if (!queue || queue.count <= 0) {
            return message.channel.send(this.getResponse("queueEmpty", userId));

        }

        // Get next member and update queue
        let nextUser = queue.member.shift();
        this.storage.set(key, {member: queue.member, count: --queue.count});
        
        // Update memberCache of calling admin
        let adminKey = "admin." + guildId + "." + userId + ".cachedMembers";
        this.storage.set(adminKey, nextUser);

        return message.channel.send(this.getResponse("nextUp", nextUser.id));
    }   
}


module.exports = Dequeue;