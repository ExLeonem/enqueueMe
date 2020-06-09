const Command = require('../core/command');
const Communication = require('../core/communication');


/**
 * Peeks into the queue to check the next-x members in line.
 * 
 * @author Maksim Sandybekov
 * @date 25.05.2020
 * @version 1.0
 * 
 * @extends Command
 */
class Peek extends Command {

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
        let userId = com.getUserId();
        if (com.isDirect()) {
            return message.channel.send(com.getDefaults("directMessage", userId));
        }

        // Communication on channel is not allowed
        let asAdmin = true;
        if (!com.isAllowed(asAdmin)) {
            return message.channel.send(com.getReason());
        }

        // To many arguments passed
        if (args.length > 1) {
            return message.channel.send(this.getResponse("tooManyArgs", userId));
        }


        let guildId = com.getGuildId();
        let queue = this.storage.get("queue." + guildId);
        let responseMessage = this.getResponse("emptyQueue", userId); 
        // Queue is empty or not existent
        if ((queue && queue.count == 0) || !queue) {
         return message.channel.send(responseMessage);           
        }

        // Peek for specific number of queue members
        let peekForNumber = 5;
        if (args.length == 1) {

            let number = parseInt(args[0]);
            if (!number && !(number <= 0)) {
                return message.channel.send(this.getResponse("argNotNumber"));

            } else if (number <= 0) {
                return message.channel.send(this.getResponse("argTooSmall", number));

            }

            peekForNumber = number;
        }

        responseMessage = this.getNMembers(peekForNumber, queue);
        return message.channel.send(responseMessage);
    }



    /**
     * Aggregates n-members of the queue into a response messsage.
     * Returns an adequat messge if not enough members are in queue.
     * 
     * @param {number} numberOfMembers Number of members to peek into to queue from the head
     * @param {Object} queue The queue itself.
     */
    getNMembers(numberOfMembers, queue) {

        let messageType = "numMembers";
        if (queue.count < numberOfMembers) {
            messageType = "lessMembers";
            numberOfMembers = queue.count;
        }

        if (queue.count == 1) {
            messageType = "singlePerson";
            
            return this.getResponse(messageType, queue.member[0].id);
        }

        let members = "";
        for (let i = 0; i < numberOfMembers; i++) {

            members += (i+1) + ". <@" + queue.member[i].id + ">\n";
        }


        return this.getResponse(messageType, members);
    }

}


module.exports = Peek;