

/**
 * Check if variable has 
 * 
 * @author Maksim Sandybekov
 * @date 9.05.2020
 */
class Type {


    static isArray(value) {
        return value instanceof Array || typeof value === "array";
    }


    static isString(value) {
        return value instanceof String || typeof value === "string";
    }

    static isObject(value) {
        return value instanceof Object || typeof value === "object";
    }
}


module.exports = Type;