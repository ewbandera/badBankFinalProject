const app = require('./index');
const dal = require('./dal');
const supertest = require('supertest');
const request = supertest(app);

// it('verify data', async done => {
//     const data = await request.get('/account/all');
//     console.log(data);
//     //expect(1).toBe(1);
//     expect(data.body.some(e => e.name === "Bank ATM")).toBeTruthy();
//     expect(data.body.some(e => e.name ==="Eric Bandera")).toBeTruthy();
//     expect(data.body.some(e => e.name ==="Demo Guest (Alice)")).toBeTruthy();
//     done();

// });

it('runs fake test', async ()=> {
        const data = await request.get('/fake/test');
        console.log('results', data.body.results);
        expect(data.body.results).toBe("Fake Results");
});

var server = app.listen(3001, function() {
    console.log('Running on port 3001');
});

 afterAll(done => {
//     dal.closeDB();
     server.close();
     done();
 });