const LocalStrategy = require('passport-local').Strategy;
const DataBase = require('../db');

function setAuth(passport) {
    const authStrategy = new LocalStrategy((username, password, done) => {
        DataBase.getUser({ username, password }, done);
    });

    passport.use(authStrategy);

    passport.serializeUser((username, done) => {
        done(null, username);
    });

    passport.deserializeUser((username, done) => {
        done(null, username);
    });
}

module.exports = setAuth;
