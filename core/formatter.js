
/**
 * Provide methods to process strings with template sequences.
 * 
 * @author Maksim Sandybekov
 * @date 29.05.2020
 * @version 1.0
 */
class Formatter {

    /** 
     * Performs replacement of template sequences in a reponse text, using arguments passed besides text.
     * 
     * @example
     * formatResponse("Hello, {0}", "John"); // returns "Hello, John"
     * 
     * 
     * @param {string} text The response text, which may include template sequences of form {0}, {1}, ...
     * @return {string} The reponse text with replaced template sequences.
     */
    static format(text) {

        // Tokens of undefined text can't be replaced.
        if (!text) {
            throw new TypeError("(Error in command.js/_formatResponse) Can't replace tokens of undefined String.");
        }

         // Replace keys in string 
         let argumentKeys = Object.keys(arguments).sort().slice(1).map(paramIndex => parseInt(paramIndex)-1);
         let result = text;
         for (let key of argumentKeys) {
             result = result.replace(new RegExp("\\{" + key + "\\}", 'g'), arguments[key+1]);
 
         }

         return result;
    }

}



module.exports = Formatter;