db.createUser({
    user: 'root',
    pwd: 'toor',
    roles: [
      {
        role: 'readWrite',
        db: 'testDB',
      },
    ],
  });
db = new Mongo().getDB("badbank");
db.createCollection('users', { capped: false });
db.createCollection('transactions', { capped: false });
db.users.insert([
    {
        "name":"Bank ATM",
        "email":"badbank@gmail.com",
        "password":"",
        "firebaseId":"",
        "role":"Guest",
        "balance":100000000
    },
    {
        "name":"Demo Guest (Alice)",
        "email":"alice@gmail.com",
        "password":"123456",
        "firebaseId":"W1ZEu75JluMQFd1zDe8BRkvSOMs1",
        "role":"Guest",
        "balance":10000
    },
    {
      "name":"Demo User (Bob)",
      "email":"bob@gmail.com",
      "password":"123456",
      "firebaseId":"nQ4giVsCBXdsti5wwWqXYGJzUgC2",
      "role":"User",
      "balance":10000
    },
    {
      "name":"Demo Admin (Chuck)",
      "email":"chuck@gmail.com",
      "password":"123456",
      "firebaseId":"lJOCm6emwyNZmwRZ723i2FvAfsr2",
      "role":"Admin",
      "balance":10000
    },
    {
      "name":"Eric Bandera",
      "email":"ericbandera@gmail.com",
      "password":"",
      "firebaseId":"jUsPDfAK1MSWCL6JWMq7Maakoj03",
      "role":"Admin",
      "balance":10000
     }
  ]);