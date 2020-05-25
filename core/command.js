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
     * Returns a specific response for a user, additionally supplied arguments besides name are used to replace template sequeuence of the string.
     * Example: getReponse("welcome", "Hello", "Max") => will get the "welcome" response under the calling command and replace {0} with "Hello" and {1} with "Max"
     * 
     * @param {*} name
     * @param {string} args - Additional values may be passed similiar to a format function 
     * 
     * @return {string} Response for the user.
     */
    getResponse(name) {

        // No response under given key
        let response = this.responses[name];
        if (!response) {
            return "";
        }

        // Replace keys in string 
        let argumentKeys = Object.keys(arguments).sort().slice(1).map(paramIndex => parseInt(paramIndex)-1);
        let result = response;
        for (let key of argumentKeys) {
            result = result.replace(new RegExp("\\{" + key + "\\}", 'g'), arguments[key+1]);

        }

        return result;
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