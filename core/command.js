

/**
 * Base class for commands.
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
        this.name = name;
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

        let commandCall = this.execute;

        return {
            name: this.name,
            ...this.params,
            execute(message, args) {
                commandCall(message, args);
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
     * Return command description.
     * 
     * @return {string}
     */
    getDescription() {
        return this.getDescription;
    }
}

module.exports = Command;