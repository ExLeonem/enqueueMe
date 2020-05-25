


/**
 * String utilities to ease working with strings.
 * 
 * @author Maksim Sandybekov
 * @date 25.05.2020
 */
class StringUtils {

    /**
     * Returns a completed template string, additionally supplied arguments besides the template string are used to replace template sequeuence of the string.
     * Example: getResponse("welcome", "Hello", "Max") => will get the "welcome" response under the calling command and replace {0} with "Hello" and {1} with "Max"
     * 
     * @param {*} text Template string to be filled
     * @param {string} args Additional values may be passed similiar to a format function 
     * 
     * @return {string} Completed tempate string.
     */
    static fillTemplate(text) {

        if (text === "") {
            console.log("return empty text");
            return text;

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



module.exports = StringUtils;


