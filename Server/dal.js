const firebase = require('firebase/app');
const initializeApp = require('firebase/app').initializeApp;
const auth = require('firebase/auth');
require('dotenv').config();

const {MongoClient,ObjectId} = require('mongodb');
const firebaseConfig = require('./firebaseConfig.js');
let url = 'mongodb://db:27017';
if(process.env.DEPLOYMENT_MODE==="DEV") url = 'mongodb://localhost:27017';

let db = null;  
console.log(firebaseConfig);
const app = initializeApp(firebaseConfig());

//connect to mongo
MongoClient.connect(url, {useUnifiedTopology: true}, function(err, client) {
   
    console.log("connected to db");
   
    db = client.db('badbank');
    
});

//create user account
function create(name, email, password,firebaseId,role) {
    return new Promise((resolve, reject) => {
        const collection = db.collection('users');
        const doc = {name, email, password, firebaseId, role, balance:Number(10000)};
        collection.insertOne(doc, {w:1}, function(err, result) {
            err ? reject(err) : resolve(doc);
        });
    })
}

function getEndingBalanceForUser(userId,amount){
    return new Promise((resolve, reject) => {
        let balance = db
            .collection('users')
            .find({"_id":ObjectId(userId)},{"balance":1,_id:0})
            .toArray(function(err, docs) {
                const result = (docs.length > 0) ? docs[0]:{};
                //console.log(result.balance);
                err ? reject(err) : resolve({"balance":result.balance,"friendlyName":result.name});
            })
    });
}

//create transaction for user
function createTransaction(transactionDate, userIdFrom,userIdTo,amount,userFromEndingBalance, userFromFriendlyName, userToEndingBalance, userToFriendlyName){
    return new Promise((resolve, reject) => {
        const collection = db.collection('transactions');
        const doc = {transactionDate, userIdFrom, userIdTo, amount, userFromEndingBalance, userFromFriendlyName, userToEndingBalance,userToFriendlyName};
        collection.insertOne(doc, {w:1}, function(err, result) {
            err ? reject(err) : resolve(doc);
        });
    })
}

function getTransactions(userId){
    return new Promise((resolve, reject) => {
        const transactions = db
            .collection('transactions')
            .find({$or:[{"userIdFrom":userId},{"userIdTo":userId}]})
            .sort({"transactionDate":1})
            .toArray(function(err, docs) {
                //console.log('getTransactions err', err);
                //console.log('getTransactionsdocs', docs);
                const result = (docs.length > 0) ? docs:{};
                if (err) reject(err)
                else {
                    resolve(result);
                } 
            })
    }); 
}

function getAllTransactions(){
    return new Promise((resolve, reject) => {
        const transactions = db
            .collection('transactions')
            .find({})
            .sort({"transactionDate":1})
            .toArray(function(err, docs) {
                console.log('getTransactions err', err);
                console.log('getTransactionsdocs', docs);
                const result = (docs.length > 0) ? docs:{};
                if (err) reject(err)
                else {
                    resolve(result);
                } 
            })
    });
}

function updateBalance(userIdFrom,userIdTo,amount){
    return new Promise((resolve, reject) => {
        const collection = db.collection('users');
        amount=Number(amount);
        //console.log('inside dal updating balance',userIdFrom,userIdTo,amount);
        //update one user
        collection.updateOne({_id: ObjectId(userIdTo)}, { $inc: {balance: Number(amount)}}, {w:1}, function(err, res) {
            if (err) {
                console.log('error in updating user To balance', err);
                reject(err)
            }else {
                console.log(res.result);
                //resolve(res.result);
            }
        })
                  
        collection.updateOne({_id: ObjectId(userIdFrom)}, { $inc: {balance: Number(-amount)}}, {w:1}, function(err, res) {
            if (err) {
                console.log('error in updating user To balance');
                reject(err)
            }else {
                console.log(res.result);
                //resolve(res.result);
            }
        });
        resolve({"Success":"Records Updated"});   
    })
}
function all() {
    return new Promise((resolve, reject) => {
        const customer = db
            .collection('users')
            .find({})
            .toArray(function(err, docs) {
                err ? reject(err) : resolve(docs);
            })
    });
}
function getUserByFirebaseId(id){
    return new Promise((resolve, reject) => {
        const customer = db
            .collection('users')
            .find({"firebaseId":id})
            .toArray(function(err, docs) {
                console.log(docs, err);
                const result = (docs.length > 0) ? docs[0]:{};
                err ? reject({"error":err}) : resolve(result);
            })
    });
}
function getBankATMAccount(){
    console.log('getting bank ATM');
    return new Promise((resolve, reject) => {
        const customer = db
            .collection('users')
            .find({"name":"Bank ATM"})
            .toArray(function(err, docs) {
                console.log('bank atm acct docs err',docs, err);
                const result = (docs.length > 0) ? docs[0]:{};
                err ? reject({"error":err}) : resolve(result);
            })
    });
}




module.exports = {create, all, getUserByFirebaseId, updateBalance,createTransaction,getEndingBalanceForUser,getTransactions,getAllTransactions,getBankATMAccount}