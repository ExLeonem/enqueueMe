const Command = require('../core/command');
const { adminRole } = require('../config.json');


/**
 * Put a dequeued user back into the queue. User is put will be put into .
 * 
 * @author Maksim Sandybekov
 * @date 20.05.2020
 */
class PushBack extends Command {

    constructor(storage, fileName) {
        super(fileName);
        this.storage = storage;
        
    }


    execute(message, args) {


        // User to put back.
        let userId = message.member.id;
        let key = "admin." + userId + ".cachedMembers";
        let cachedUsers = this.storage.get(key);

        if (cachedUsers != undefined && cachedUsers.length <= 0) {
            return message.channel.send(`<@${userId}> seems like you didn't dequeue any member. You can dequeue with */next*. You can try again after you performed the dequeue command.`);

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

        return message.channel.send(`I've put <@${lastUserCached.id}> back into the queue.`)
    }
}




module.exports = PushBack;