const FileUtils = require('../../core/file');
FileUtils.createDefaultConfig();

const Dequeue = require('../../commands/dequeue');
const MessageMock = require('../../core/messageMock');
const Storage = require('../../core/storage');

let storage = Storage.getInstance();
let dequeue = new Dequeue("dequeue");


test("call by non-admin", () => {
    
});


test("call by admin", () => {

});


test("dequeue empty queue", () => {

});


test("dequeue non-empty queue", () => {

});