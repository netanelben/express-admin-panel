require('dotenv').config();
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    username: String,
    password: String
});

const connection = mongoose.createConnection(process.env.DB_URL);
const User = connection.model('User', schema);

function addUser(username, password) {
    const newUser = new User({ username, password });

    newUser.save((err) => {
        // Handle error
    });
}

function findUser(username) {
    User.find({ username })
    .exec(function (err, result) {
        if (!err) {
            // Handle result
            console.log(err);
        } else {
            // Handle error
            console.log(result);
        };
    });
}

module.exports = {
    addUser,
    findUser
}
