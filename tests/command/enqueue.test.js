const fs = require('fs');
const path = require('path');
const process = require('process');

const Enqueue = require('../../commands/enqueue');
const Storage = require('../../core/storage');


const storage = new Storage();
const enqueue = new Enqueue(storage);

// Setup 
beforeEach(() => {
    
    // Reset the queue to initial values
    let initQueue = {
        "members": [],
        "count": 0
    };

    storage.set("queue", initQueue);
});




test("Enqueue user", () => {


});


test("User already enqueued", () => {

});