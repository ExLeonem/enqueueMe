
/**
 * Check if variable has 
 * 
 * @author Maksim Sandybekov
 * @date 9.05.2020
 * @version 1.0
 */
class Type {


    /**
     * Check if a value is an array.
     * 
     * @param {*} value The value to check 
     * @return {boolean} true | false
     */
    static isArray(value) {
        return value instanceof Array || typeof value === "array";
    }


    /**
     * Check if a value is a string.
     * 
     * @param {*} value The value to check 
     * @return {boolean} true | false
     */
    static isString(value) {
        return value instanceof String || typeof value === "string";
    }


    /**
     * Check if a value is an object.
     * 
     * @param {*} value The value to check 
     * @return {boolean} true | false
     */
    static isObject(value) {
        return value instanceof Object || typeof value === "object";
    }


    /**
     * Check if a value is a boolean.
     * 
     * @param {*} value The value to check 
     * @return {boolean} true | false
     */
    static isBool(value) {
        return typeof value === "boolean";
    }
}


module.exports = Type;