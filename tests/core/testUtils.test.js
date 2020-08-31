const { cleanupDir } = require('../../core/testUtils');


test("Cleanup non-existent path.", () => {

    cleanupDir();
    cleanupDir();
    expect(true).toBe(true);
});