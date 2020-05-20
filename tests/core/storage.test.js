const fs = require('fs');
const path = require('path');
const process = require('process');
const Storage = require('../../core/storage');


const dataPath = path.join(process.cwd(), "data");
let storage;


// Setup 
beforeEach(() => {
    storage = new Storage();

});


// Teardown
afterEach(() => {

    // Clear directory of existing files
    fs.readdirSync(dataPath, {"withFileTypes": true}).forEach((element) => {

        let itemPath = path.join(dataPath, element.name);

        // Clean-up json files from directory
        if (element.isFile()) {
            fs.unlinkSync(itemPath);
        }
    });
});


test("Initial files are created", () => {

    let dataDirContent = fs.readdirSync(dataPath);

    expect(dataDirContent.length).toBeGreaterThan(0);

});


test("Adding new key to default", () => {

    let value = "hello";
    storage.set("queue.var", value);

    // Manually read the file and parse content to object
    let filePath = path.join(dataPath, "queue.json");
    let content = JSON.parse(fs.readFileSync(filePath));

    expect(content.var).toBe(value);
});


test("Update single key under json file", () => {

    let newValue = 2;
    storage.set("queue.count", newValue);

    let filePath = path.join(dataPath, "queue.json");
    let content = JSON.parse(fs.readFileSync(filePath));

    expect(content.count).toBe(23);
});


test("Update complete file", () => {

    let newValue = {
        count: 12,
        members: []
    };
    storage.set("queue", newValue);

    let filePath = path.join(dataPath, "queue.json");
    let content = JSON.parse(fs.readFileSync(filePath));

    expect(content.count).toBe(12);
});


test("Retrieve file content", () => {

    let defaultMemberCount = storage.get("queue.count");
    expect(defaultMemberCount).toBe(0);
});