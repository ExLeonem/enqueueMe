const Type = require('../../core/type');



test("Is array", () => {
    
    expect(Type.isArray([2, 4, 1])).toBe(true);
})


test("Not array", () => {

    expect(Type.isArray({"value": [2, 5, 3]})).toBe(false);
});


test("Is object", () => {

    expect(Type.isObject({"value": "none"})).toBe(true);
    expect(Type.isObject(Type)).toBe(true);
});


test("Not object", () => {

    expect(Type.isObject(22)).toBe(false);
});


test("Is boolean", () => {

    expect(Type.isBool(true)).toBe(true);
    expect(Type.isBool(false)).toBe(true);
});


test("Not boolean", () => {

    expect(Type.isBool("true")).toBe(false);
    expect(Type.isBool(1)).toBe(false);
    expect(Type.isBool(-1)).toBe(false)
});