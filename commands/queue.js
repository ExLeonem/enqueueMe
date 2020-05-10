const Command = require('../core/command');

/**
 * Command to queue a member of a server
 * 
 * @author Maksim Sandybekvo
 * @date 10.05.2020
 */
class Queue extends Command {

    constructor(storage) {
        super("ping", { description: "return me something"});
        this.storage = storage;
    }  


    execute(message, args) {
        message.channel.send("Hello world");
    }
    
}


module.exports = Queue;




// module.exports = {
// 	name: 'ping',
// 	description: 'Ping!',
// 	execute(message) {
// 		message.channel.send('Pong.');
// 	},
// };