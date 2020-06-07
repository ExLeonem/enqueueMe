const Command = require('../core/command');
const Communication = require('../core/communication');
const defintions = require('')

// Default configuration
const config = require('../config.json');



/**
 * Set guild specific configurations for the queue.
 * 
 * @class
 * @author Maksim Sandybekov
 * @date 06.05.2020
 */
class Config extends Command {

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
        
        // Show configured channels /config channel add <name> <category>

    }


    /**
     * 
     * @param {string[]} args Parameters received from the user.
     */
    dispatchOptions(args) {

        if (args.length < 1) {
            return message.channel.send();
        }

        // Dispatch on main command
        let argKey = args.shift();
        switch(argKey) {
            case "channel": {

                break;
            }
            case "queue": {

            }
            default: 
        }

    }


    channelConfig(args) {

    }




    showChannels() {

    }


    addChannel(name, category) {

    }



    setConfig() {

    }


}


module.exports = Config;