const express = require('express');
const app = express();
var dal = require('./dal.js');
const admin   = require('./admin.js');
const swaggerUI = require('swagger-ui-express');
//const swaggerJsDoc = require('swagger-jsdoc');
const swaggerDocument = require('./swagger.json');
const path = require('path');

const cors = require('cors');
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const swaggerDocs = require('./swagger.json');
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
  });

app.post('/account/create', function(req, res) {
    console.log('creating account');
    dal.create(req.body.name, req.body.email, req.body.password,req.body.firebaseId, req.body.role)
        .then((resp) => {
            //console.log(resp);
            res.send(resp);
        })
        .catch((err) => {
            console.log(err);
            res.send({"error":err});
        });
});
app.post('/transaction/create', async function(req, res) {
    console.log('creating transaction');
    let amount = Number(req.body.amount);
    let userFromEndingBalance=0;
    let userFromFriendlyName = '';
    let userToEndingBalance=0;
    let userToFriendlyName = '';

    try{
        ({balance,friendlyName} = await dal.getEndingBalanceForUser(req.body.userIdFrom,-amount));
        userFromFriendlyName=friendlyName;
        userFromEndingBalance = balance;
        console.log('balanceFrom', balance);
    }
    catch(err){
        console.log("error from bal",err);
        res.status(400).send('Bad Request' + err);
        return;
    }
    try{
        ({balance,friendlyName} = await dal.getEndingBalanceForUser(req.body.userIdTo, amount));
        userToFriendlyName = friendlyName;
        userToEndingBalance = balance;
        //console.log('balanceTo', balance);
    }
    catch(err){
        console.log("error to bal",err);
        res.status(400).send('Bad Request' + err);
        return;
    }
    console.log(userFromEndingBalance, userToEndingBalance);
    dal.createTransaction(new Date(),req.body.userIdFrom,req.body.userIdTo,amount,Number(userFromEndingBalance)-amount,userFromFriendlyName, Number(userToEndingBalance)+amount,userToFriendlyName)
        .then((resp,err) => {
            if(err) {
                res.status(400).send('Bad Request' + err);
                return;
            }
            else{
                //console.log(resp);
                res.send(resp);
            }
            
        })
        .catch((err) => {
            res.status(400).send('Bad Request' + err);
            return;
        });
});
app.get('/transactions/all', function(req, res) {
    const idToken = req.headers.authorization
   
    if(idToken){
        admin.auth().verifyIdToken(idToken)
        .then(function(decodededToken) {
            console.log('getting all transactions');
            dal.getAllTransactions()
            .then((docs,err) => {
                if(err) {
                    //console.log(err);
                    res.send({"error":err});
                }
                else{
                    //console.log('docs index', docs);
                    if(docs.length>0)
                    {
                    let finalResults = docs.map((item)=>{ 
                        return {
                            "transactionDate":item.transactionDate,
                            "userFromFriendlyName":item.userFromFriendlyName,
                            "userToFriendlyName": item.userToFriendlyName,
                            "amount":(Number(item.amount)/100).toFixed(2),                         
                        }
                    });
                    res.send(finalResults);
                }
                else res.send({});
                }
            });
        })
        .catch(function(error) {
            console.log('error:', 'Authentication Failed',error);
            res.send({"error":"Authentication Fail on Route"});
        });
    }
    else{
        console.log('not authorized');
        res.status(401).send('You are not authorized');
    }
          
    });

app.get('/transactions/:id', function(req, res) {
    dal.getTransactions(req.params.id)
        .then((docs,err) => {
            if(err) {
                //console.log(err);
                res.send({"error":err});
            }
            else{
                //console.log('docs index', docs);
                if(docs.length>0)
                {
                let finalResults = docs.map((item)=>{   
                    const deposit = (item.userIdFrom!==req.params.id);
                    if(deposit)
                    {
                        return {
                            "transactionDate":item.transactionDate,
                            "transactionType":"Deposit",
                            "description": item.userFromFriendlyName,
                            "amount":(Number(item.amount)/100).toFixed(2),
                            "balance":(Number(item.userToEndingBalance)/100).toFixed(2)
                        }
                    }
                    else{
                        return {
                            "transactionDate":item.transactionDate,
                            "transactionType":"Withdraw",
                            "description": item.userToFriendlyName,
                            "amount":(Number(item.amount)/100).toFixed(2),
                            "balance":(Number(item.userFromEndingBalance)/100).toFixed(2)
                        }
                    }
                });
                res.send(finalResults);
            }
            else res.send({});
            }
        });
});

app.get('/fake/test', function (req, res) {
    res.send({"results":"Fake Results"});
});

app.get('/account/all', function(req, res) {
    dal.all()
        .then((docs) => {
            //console.log(docs);
            res.send(docs);
        });
});
app.get('/account/firebaseId/:id', function(req,res) {
    console.log('getting user by firebase Id');
    dal.getUserByFirebaseId(req.params.id)
        .then((user) => {
            console.log(user);
            res.send(user);
        })
        .catch((err) => {
            console.log(err);
            res.send({error:"Error contacting service"})
        });
});
app.get('/account/default', function(req,res) {
    console.log('getting default user')
    dal.getBankATMAccount()
        .then((user) => {
            console.log(user);
            res.send(user);  
        })
        .catch((err) => {
            console.log(err);
            res.send({error:"Error contacting service"})
        });
});

app.post('/account/updateBalance', function(req, res) {
    console.log('updating Balance', req.body);
   
    dal.updateBalance(req.body.userIdFrom, req.body.userIdTo, req.body.amount)
        .then((resp) => {
            //console.log(resp);
            //console.log('inside index response');
            res.send(resp);

        })
        .catch((err) => {
            console.log(err);
            //console.log('inside index err');
            res.send({"error":err});
        });

});
app.listen('3001', () =>
{
    console.log('listening on port 3001');
});

module.exports = app;

