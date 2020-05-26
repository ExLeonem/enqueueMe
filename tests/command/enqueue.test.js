const { getConfig, writeConfig } = require('../../core/testUtils');
const Enqueue = require('../../commands/enqueue');
const Storage = require('../../core/storage');
const definitions = require('../../commands/definitions.json');

const storage = new Storage();
const enqueue = new Enqueue(storage, "enqueue");


const cachedConfig = getConfig();


test("Enqueue user", () => {

    // Write new config
    writeConfig({
        ...cachedConfig,
        channels: {
            category: "bot",
            member: "member",
            admin: "admin"
        }
    });

    // Mock message object
    let message = {
        member: {
            id: 1234,
            user: {
                username: "Max Mustermann",
                discriminator: "2324"
            }
        },
        guild:  {
            id: 234234,
            channels: {
                cache: {
                    find: function(callback) {

                        let elements = [
                            {name: "member"},
                            {name: "test"},
                            {name: "someElse"}
                        ]
                        for (let element of elements) {
                            
                            if (callback(element)) {
                                return {
                                    ...element,
                                    send: function(content) {
                                        return content;
                                    }
                                };
                            }
                        }
                    }
                }
            }
        },
        channel: {
            parent: {
                name: "bot"
            }
        }
    }

    let actual = enqueue.execute(message, []);
    let expected = enqueue.formatReponse(definitions.enqueue.responses.enqueue, message.member.id)
    expect(actual).toBe(expected);
});


test("User already in queue", () => {

});


test("Same user different server", () => {

});


test("Don't allow direct messages", () => {

})

test("Wrong channel", () => {


});


test("Wrong category", () => {


});