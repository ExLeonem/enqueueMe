const Cancel = require('../../commands/cancel');
const Storage = require('../../core/storage');


const storage = new Storage();
const cancel = new Cancel(storage);


test("Cancel enqeued user", () => {

    expect(true).toBe(false);
});


test("Cancel user who is not enqueued", () =>  {

    expect(true).toBe(false);
});