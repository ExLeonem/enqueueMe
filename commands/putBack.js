const Command = require('../core/command');
const Communication = require('../core/communication');


/**
 * Put a dequeued user back into the queue. User is put will be put into .
 * 
 * @author Maksim Sandybekov
 * @date 20.05.2020
 * @version 1.0
 * 
 * @extends Command
 */
class PutBack extends Command {

    /**
     * @constructor
     * @param {string} fileName 
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


        // User to put back.
        let userId = com.getUserId();
        let guildId = com.getGuildId();
        let key = "admin." + guildId + "." + userId + ".cachedMembers";
        let cachedUser = this.storage.get(key);

        if (cachedUser == undefined || cachedUser == null || cachedUser.length <= 0) {
            return message.channel.send(this.getResponse("noUser", userId));

        }

        // Update the storage
        this.storage.set(key, null);

        // Get the index where to put the cached used
        let queue = this.storage.get("queue." + guildId);

        let index = 0;
        let alreadyWaiting = false;
        for (let i = index; i < queue.member.length; i++) {

            if (queue.member[i].time < cachedUser.time) {
                index = i;
                continue;

            }

            // User is enqueued already, don't insert (user, re-enqueued)
            if (cachedUser.id == queue.member[i].id) {
                alreadyWaiting = true;
                break;

            }
        }

        // Update the queue
        if (!alreadyWaiting) {
            queue.member.splice(index + 1, 0, cachedUser);
            queue.count += 1;
            this.storage.set("queue", queue);

        }

        return message.channel.send(this.getResponse("success", userId, cachedUser.id))
    }
}




module.exports = PutBack;