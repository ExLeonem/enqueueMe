const Formatter = require('../../core/formatter');


test("undefined template string", () => {

    let fn = () => {
        Formatter.format(undefined)
    };

    expect(fn).toThrow(TypeError);
});
