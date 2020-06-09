
const woker = require('worker_threads');


/**
 * Multi-Threaded dynamic programm to calculate the string similiarity
 * of a main string and a couple of other strings.
 * 
 * Algorithm used: Levenshtein-Distance (Edit-Distance) 
 * 
 * @author Maksim Sandybekov
 * @date 11.05.2020
 * @version 1.0
 */
class StringSimiliarty {


    /**
     * Calculate the string similiarty between one main String and a single or multiplie other strings.
     * 
     * @param {*} mainString 
     * @param  {...any} otherStrings 
     * 
     * @return {Array} String similiarities between main string and every other string
     */
    static calculate(stringA, ...otherStrings) {


        console.log(otherStrings);
    }


    static _build_field() {

    }
}


module.exports = StringSimiliarty;