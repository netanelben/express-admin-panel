require('dotenv').config();
const MongoClient = require('mongodb').MongoClient;
const createHash = require('./utils/crypt');

const dbName = process.env.DB_NAME
const url = process.env.DB_URL;

function init() {
    const client = new MongoClient(url);

    return new Promise((resolve, reject) => {
        client.connect((err) => {
            resolve(client.db(dbName));
        });
    });
}

function loginUser(result, req, res) {
    if(!result) { return res.status(400).send('Username already exists!'); }

    const insertedId = result.insertedId;

    req.login(insertedId, () => {
        res.redirect('/');
    });
}

class DataBase {
    static addUser({ username, password }, req, res) {
        init().then((db) => {
            const collection = db.collection('users');

            createHash(password).then((password) => {
                collection.insertOne({
                    username,
                    password
                }, (err, result) => { loginUser(result, req, res); })
            });
        });
    }

    // static getUserId({ username }) {
    //     this.client = new MongoClient(url);

    //     this.client.connect((err) => {
    //         const db = this.client.db(dbName);
    //         const collection = db.collection('users');

    //         return collection.find({ 'username': username });
    //     });
    // }

    // findUsername(db, username) {
    //     const collection = db.collection('users');

    //     return collection.find({ 'username': username }, (err, result) => result);
    // }

    // static async getUsers(db) {
        // this.client = new MongoClient(url);

        // this.client.connect((err) => {
        //     const db = this.client.db(dbName);
        //     const collection = db.collection('users');

        //     return await collection.find({});
        // });

        // collection.find({}).toArray((err, result) => {
        //     console.log(result);
        // });
    // }

    close() {
        this.client.close();
    }
}

module.exports = DataBase;
