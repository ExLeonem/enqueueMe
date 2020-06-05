const Command = require('../core/command');
const Communication = require('../core/communication');
const { adminRole } = require('../config.json');


/**
 * Put a dequeued user back into the queue. User is put will be put into .
 * 
 * @author Maksim Sandybekov
 * @date 20.05.2020
 * 
 * @class
 * @extends Command
 */
class PushBack extends Command {

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
         if (!com.isAllowed()) {
             return message.channel.send(com.getReason());
         }


        // User to put back.
        let userId = com.getUserId();
        let key = "admin." + userId + ".cachedMembers";
        let cachedUsers = this.storage.get(key);

        if (cachedUsers != undefined && cachedUsers.length <= 0) {
            return message.author.send(`<@${userId}> seems like you didn't dequeue any member. You can dequeue with */next*. You can try again after you performed the dequeue command.`);

        }

        // Get last person cached and update current user cache
        let lastUserCached = cachedUsers.shift();
        this.storage.set(key, cachedUsers);

        // Get the index where to put the cached used
        let queue = this.storage.get("queue");
        let index = 0;
        let alreadyWaiting = false;
        for (let i = index; i < queue.member.length; i++) {

            if (queue.member[i].time > lastUserCached.time) {
                index = i;
                continue;

            }

            // User is enqueued again, don't insert
            if (lastUserCached.id == queue.member[i].id) {
                alreadyWaiting = true;
                break;

            }
        }

        // Update the queue
        if (!alreadyWaiting) {
            queue.member.splice(index, 0, lastUserCached);
            queue.count += 1;
            this.storage.set("queue", queue);

        }

        return message.author.send(`I've put <@${lastUserCached.id}> back into the queue.`)
    }
}




module.exports = PushBack;