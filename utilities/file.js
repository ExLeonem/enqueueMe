const fs = require('fs');
const path = require('path');
const process = require('process');


/**
 * Utilities to write and load json data to disk
 * 
 * @author Maksim Sandybekov
 * @date 7.5.20
 */
class FsUtil {

    /**
     * 
     * @param {string} dirPath Path to directory where to write data to, defaults to /data (from project root).
     */
    constructor(dirPath = path.join(process.cwd(), "..", "data")) {
        this.workingDir = dirPath;
        
        createNonExistent();
    }


    /**
     * Setup a data storage in form of a directory, loading already existing files.
     * 
     * @param {string} path Path of the directory where to setup a directory 
     */
    setupDataStorage(path) {

    }


    /**
     * Read data from the storage.
     */
    readData() {

    }

    writeData(data) {

    }


    /**
     * Creates a none existent 
     */
    _createNoneExistent() {

    }
}


module.exports = FsUtil;