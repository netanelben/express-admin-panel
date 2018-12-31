require('dotenv').config();
const MongoClient = require('mongodb').MongoClient;
const { createHash, compareHash } = require('./utils/crypt');

const dbName = process.env.DB_NAME
const url = process.env.DB_URL;

function init() {
    const client = new MongoClient(url);

    return new Promise((resolve, reject) => {
        client.connect((err) => {
            resolve(client.db(dbName));
        });

        client.close();
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

    static getUser({ username, password }, done) {
        init().then((db) => {
            const collection = db.collection('users');

            collection.findOne({ username }, (err, result) => {
                const hash = result.password,
                    isValid = compareHash(password, hash);

                isValid.then((results) => {
                    if (!results) { return done(null, false); }

                    return done(null, { username });
                });
            });
        });
    }
}

module.exports = DataBase;
