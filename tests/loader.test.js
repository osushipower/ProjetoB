const axios = require('axios');
const apiGetAirTable = require('../js/apigetter')

jest.mock('axios');

// MOCK_STATUS = ['200', '400', '401'];

// global.fetch = jest.fn(() => Promise.resolve({
//     json: () => Promise.resolve(MOCK_STATUS)
// }));

test("Testing API", async () => {

    const result = await apiGetAirTable("key2CwkHb0CKumjuM");
    console.log(result)
    
    // await expect(apiGetAirTable("key2CwkHb0CKumjuM")).resolves.toEqual(undefined);
})