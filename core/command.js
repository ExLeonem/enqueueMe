const definitions = require('../commands/definitions.json');


/**
 * Parent class of every command.
 * Defines general api of a command.
 * 
 * @author Maksim Sandybekov
 * @date 10.05.2020
 */
class Command {

    /**
     * 
     * @param {String} name - name of the command
     * @param {Object} params - additional paramters
     */
    constructor(name, params = {}) {
        let command = definitions[name] || "";

        this.name = command.name || name;
        this.responses = command.responses || {};
        this.params = params;
    }


    /**
     * Returns a message to the user
     * 
     * @param {*} message A message object to interact with the user.
     * @param {*} args Arguments passed with previous command.
     */
    execute(message, args) {
        return message.channel.send("Execute template");
    }
    

    /**
     * Return the command as an js object not class object.
     *  
     * @return {Object}
     */
    getCommand() {

        let commandObject = this;

        return {
            name: this.name,
            ...this.params,
            execute(message, args) {
                return commandObject.execute(message, args);
            }
        }
    }


    /**
     * Return this command name.
     * 
     * @return {string}
     */
    getName() {
        return this.name;
    }

    
    /**
     * Return the available responses defined in the command definitions file.
     * 
     * @return {Object}
     */
    getResponses() {
        return this.responses;
    }



    /**
     * Returns a specific response for a user.
     * 
     * @param {*} name 
     * 
     * @return {string} Response for the user.
     */
    getResponse(name) {

        let response = this.responses[name];
        


    }


    /**
     * Return command description.
     * 
     * @return {string}
     */
    getDescription() {
        return this.getDescription;
    }
}

module.exports = Command;