const Command = require('../core/command');

/**
 * 
 * @author Maksim Sandybekov
 * @date 10.05.2020
 */
class Dequeue extends Command {

    constructor(storage) {
        super("next");
        this.storage;
    }


    execute(message, args) {

        // console.log(message);
        // console.log(message.author);
        // console.log(message.guild.roles);

        message.channel.send("Dequeue next member.");
    }   
}


module.exports = Dequeue;